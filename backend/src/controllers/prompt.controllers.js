import TempPromptJob from '../models/temp.model.js';
import { enqueuePromptOptimization } from '../sqs/dispatchers.js';
import { AppException } from '../utils/appException.js';



export const startPromptOptimization = async (req, res, next) => {
  try {
    const { topic, code_language, instructions } = req.body;

    if (!topic) {
      throw new AppException('Topic is required.', 422);
    }

    const newJob = new TempPromptJob({
      user_id: req.user._id,
      status: 'processing',
      topic: topic,
    });

    await newJob.save();
    const jobIdStr = newJob._id.toString();

    try {
      await enqueuePromptOptimization({
        job_id: jobIdStr,
        user_id: req.user._id.toString(),
        topic: topic,
        code_language: code_language || 'C++',
        instructions: instructions || ''
      });
    } catch (queueError) {
      await TempPromptJob.findByIdAndDelete(jobIdStr);
      console.error(`[SQS Prompt Optimization Exception Alert]: ${queueError.message}`);
      throw new AppException('Could not dispatch request payload across optimization transaction channels.', 500);
    }

    res.status(202).json({
      success: true,
      jobId: jobIdStr,
      message: 'Polishing task added successfully into background workers.'
    });
  } catch (error) {
    next(error);
  }
};

export const readPromptOptimizationStatus = async (req, res, next) => {
  try {
    const { job_id } = req.params;
    const job = await TempPromptJob.findById(job_id);

    if (!job || job.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Requested prompt processing task expired or not found.', 404);
    }

    if (job.status === 'failed') {
      // Fire-and-forget deletion happens concurrently in the background event loop
      TempPromptJob.findByIdAndDelete(job_id).catch((err) =>
        console.error(`Error purging failed job record: ${err.message}`)
      );

      return res.status(200).json({
        success: true,
        status: 'failed',
        message: job.error_message || 'AI pipeline encountered processing problems.'
      });
    }

    if (job.status === 'final' || job.status === 'draft') {
      TempPromptJob.findByIdAndDelete(job_id).catch((err) =>
        console.error(`Error purging completed job record: ${err.message}`)
      );

      return res.status(200).json({
        success: true,
        status: 'final',
        optimizedInstructions: job.optimized_instructions || ''
      });
    }

    // Default status fallback returning a processing flag
    res.status(200).json({
      success: true,
      status: 'processing'
    });
  } catch (error) {
    next(error);
  }
};