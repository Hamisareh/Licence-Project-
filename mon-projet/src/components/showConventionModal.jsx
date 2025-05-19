import { useState } from "react";

const ShowConventionModal = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (file) {
      await onUpload(file);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Envoyer une convention</h3>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-[#000041] file:text-white
            hover:file:bg-[#1a1a66]"
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#000041] text-white rounded hover:bg-[#1a1a66]"
            disabled={!file}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowConventionModal;