import Theory from '../models/theory.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.js';
import { cloudinary } from '../config/cloudinary.js';
import { enqueueTheoryGeneration } from '../sqs/dispatchers.js';
import { AppException } from '../utils/appException.js';

export const generateAiTheory = async (req, res, next) => {
  let newTheory;
  try {
    const { topic, code_language, instructions } = req.body;

    if (!topic) {
      throw new AppException('Topic is required.', 422);
    }

    newTheory = new Theory({
      user_id: req.user._id,
      status: 'processing',
      topic: topic,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newTheory.save();
    const theoryIdStr = newTheory._id.toString();

    try {
      await enqueueTheoryGeneration({
        theory_id: theoryIdStr,
        user_id: req.user._id.toString(),
        topic: topic,
        code_language: code_language || 'C++',
        instructions: instructions || ''
      });
    } catch (queueError) {
      if (newTheory) await newTheory.deleteOne().catch(() => {});
      console.error(`[SQS Queue Error Details]: ${queueError.message}`);
      throw new AppException('We could not add your study note creation task to the queue right now.', 500);
    }

    res.status(202).json({
      success: true,
      message: 'Your note is being created by our AI assistant.',
      status: 'processing',
      id: theoryIdStr
    });
  } catch (error) {
    next(error);
  }
};

export const checkTheoryGenerationStatus = async (req, res, next) => {
  try {
    const { theory_id } = req.params;
    
    const theory = await Theory.findById(theory_id);

    // FIX: Match the exact same explicit fail-fast pattern for Theory modules
    if (!theory) {
      return res.status(204).json({
        success: false,
        status: 404,
        message: "The theory generation session was not found or was rolled back due to an internal failure."
      });
    }

    if (theory.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Unauthorized access.', 403);
    }

    if (theory.status === 'failed') {
      return res.status(200).json({
        success: true,
        status: 'failed',
        message: 'We could not create this note. Please try again in a few minutes.',
        id: theory._id.toString()
      });
    }

    const structuredStatus = theory.status === 'draft' ? 'final' : theory.status;

    res.status(200).json({
      success: true,
      status: structuredStatus,
      id: theory._id.toString()
    });
  } catch (error) {
    next(error);
  }
};

export const uploadTheoryImage = async (req, res, next) => {
  try {
    const { theory_id } = req.params;
    const theory = await Theory.findById(theory_id);

    if (!theory || theory.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Study note workspace not found.', 404);
    }

    if (!req.file) {
      throw new AppException('Please provide an image file to upload.', 400);
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, `algonotes/theory_${theory_id}`);

    res.status(200).json({
      success: true,
      imageUrl: uploadResult.secure_url
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTheoryImage = async (req, res, next) => {
  try {
    const { theory_id } = req.params;
    const { image_url } = req.body;

    const theory = await Theory.findById(theory_id);
    if (!theory || theory.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Study note workspace not found.', 404);
    }

    if (!image_url || !image_url.includes('cloudinary.com')) {
      throw new AppException('This is not a valid Cloudinary media asset URL.', 400);
    }

    const urlParts = image_url.split('/upload/');
    if (urlParts.length < 2) {
      throw new AppException('Invalid asset structure pattern format.', 400);
    }

    let remainder = urlParts[1];
    if (remainder.startsWith('v') && remainder.includes('/')) {
      remainder = remainder.split('/').slice(1).join('/');
    }
    const publicId = remainder.replace(/\.[^/.]+$/, ""); 

    const result = await deleteFromCloudinary(publicId);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image asset completely cleared from remote storage.'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Image reference cleared locally, file not found in bucket profile.'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllTheoriesByUser = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const size = Math.min(50, Math.max(1, parseInt(req.query.size, 10) || 10));
    const search = req.query.search ? req.query.search.trim() : null;
    const skip = (page - 1) * size;

    const baseFilter = {
      user_id: req.user._id,
      status: { $in: ['draft', 'final'] }
    };

    if (search) {
      baseFilter.$or = [
        { topic: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const totalItems = await Theory.countDocuments(baseFilter);
    const theories = await Theory.find(baseFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);

    const totalPages = totalItems ? Math.ceil(totalItems / size) : 1;

    res.status(200).json({
      success: true,
      theories,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: size,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTheoryById = async (req, res, next) => {
  try {
    const { theory_id } = req.params;
    const theory = await Theory.findById(theory_id);

    if (!theory || theory.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Study note not found.', 404);
    }

    if (theory.status === 'processing') {
      return res.status(202).json({
        success: false,
        message: 'Your study note is still being written by our assistant.'
      });
    }

    res.status(200).json({
      success: true,
      theory
    });
  } catch (error) {
    next(error);
  }
};

export const updateTheory = async (req, res, next) => {
  try {
    const { theory_id } = req.params;
    const { status, content } = req.body;

    const theory = await Theory.findById(theory_id);

    if (!theory || theory.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Study note not found.', 404);
    }

    if (status !== undefined) theory.status = status;
    if (content !== undefined) theory.content = content;

    theory.updatedAt = new Date();
    await theory.save();

    res.status(200).json({
      success: true,
      message: 'Study note updated successfully.',
      theory
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTheory = async (req, res, next) => {
  try {
    const { theory_id } = req.params;
    const theory = await Theory.findById(theory_id);

    if (!theory || theory.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Study note not found.', 404);
    }

    const folderPath = `algonotes/theory_${theory_id}`;

    try {
      // Corrected: Await resource wiping before attempting folder deletion sequentially
      await cloudinary.api.delete_resources_by_prefix(folderPath);
      await cloudinary.api.delete_folder(folderPath);
    } catch (err) {
      console.warn(`[Cloudinary Cleanup Exception Warning]: ${err.message}`);
    }

    await theory.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Study note and all associated images deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};