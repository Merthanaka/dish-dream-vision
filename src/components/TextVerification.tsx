
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Edit3, ArrowRight } from 'lucide-react';

interface TextVerificationProps {
  extractedText: string;
  onConfirm: (confirmedText: string) => void;
  onEdit: () => void;
}

const TextVerification = ({ extractedText, onConfirm, onEdit }: TextVerificationProps) => {
  const [editedText, setEditedText] = useState(extractedText);
  const [isEditing, setIsEditing] = useState(false);

  const handleConfirm = () => {
    onConfirm(editedText);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      <div className="pt-12 pb-6 px-6 text-center">
        <h1 className="font-display text-2xl font-bold text-restaurant-dark-brown mb-2">
          Review Extracted Text
        </h1>
        <p className="text-restaurant-warm-gray">
          Please verify the menu text is accurate before generating images
        </p>
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-display text-lg font-semibold text-restaurant-dark-brown">
                Extracted Menu Text
              </h3>
            </div>
            <button
              onClick={toggleEdit}
              className="flex items-center gap-2 text-restaurant-gold hover:text-restaurant-gold-light transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-64 p-4 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-restaurant-gold focus:border-transparent"
              placeholder="Edit the menu text here..."
            />
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {editedText}
              </pre>
            </div>
          )}

          {extractedText !== editedText && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Changes detected</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onEdit}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Retake Photo
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              Generate Images
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
          <p className="text-sm text-restaurant-warm-gray">
            💡 <strong>Tip:</strong> Accurate text leads to better image matching. Feel free to correct any OCR errors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextVerification;
