import { ArrowLeft, Home, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center px-4 text-center">
      {/* Visual Header Token Container */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--danger-soft)] text-[var(--danger)] animate-bounce duration-1000">
        <HelpCircle size={48} strokeWidth={1.5} />
        <span className="absolute -right-2 -top-2 flex h-6 w-10 items-center justify-center rounded-full bg-[var(--danger)] text-[10px] font-bold text-white shadow-sm">
          404
        </span>
      </div>

      {/* Main Structural Information Typography */}
      <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-5xl">
        Page Not Found
      </h1>
      
      {/* Developer-themed subtitling */}
      <p className="mt-3 max-w-md text-sm text-[var(--text-muted)] sm:text-base leading-relaxed">
        The route you are trying to access does not exist in our route table. It might have been compiled out, moved, or deleted.
      </p>

      {/* Dual Interactivity Actions Segment */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto rounded-xl"
        >
          <ArrowLeft size={16} />
          Go Back
        </Button>
      
      </div>
    </div>
  );
};

export default NotFound;