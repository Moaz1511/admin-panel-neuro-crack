'use client'
import { useParams } from 'next/navigation';

export default function QuizModuleDetailPage() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Quiz Module Detail</h1>
      <p className="text-lg">Module ID: <span className="font-mono text-blue-600">{id}</span></p>
      <div className="mt-8">
        {/* Add your Add Questions UI here */}
        <p>This is the Add Questions screen for module <b>{id}</b>.</p>
      </div>
    </div>
  );
} 