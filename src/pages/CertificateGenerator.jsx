import React, { useRef } from "react";
import { Award, Download } from "lucide-react";

const CertificateGenerator = ({ participant }) => {
  const certificateRef = useRef(null);

  const downloadCertificate = async () => {
    // Import html2canvas dynamically
    const html2canvas = (
      await import(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
      )
    ).default;

    const certificate = certificateRef.current;

    // Temporarily show the certificate for capture
    certificate.style.display = "block";

    const canvas = await html2canvas(certificate, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // Hide it again
    certificate.style.display = "none";

    // Convert to image and download
    const link = document.createElement("a");
    link.download = `${participant.name.replace(/\s+/g, "_")}_Certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <button
        onClick={downloadCertificate}
        className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm"
      >
        <Award className="w-4 h-4 mr-2" />
        Generate Certificate
      </button>

      {/* Hidden Certificate for Generation */}
      <div
        ref={certificateRef}
        style={{ display: "none" }}
        className="w-[1200px] h-[850px] relative bg-white"
      >
        {/* Border Design */}
        <div className="absolute inset-0 border-[20px] border-double border-orange-600 m-4">
          <div className="absolute inset-0 border-[3px] border-amber-500 m-2"></div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-orange-600"></div>
        <div className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-orange-600"></div>
        <div className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-orange-600"></div>
        <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-orange-600"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-20 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="text-orange-600 text-6xl mb-4">✦</div>
            <h1
              className="text-5xl font-bold text-orange-700 mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Certificate of Participation
            </h1>
            <div className="w-64 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto"></div>
          </div>

          {/* Event Name */}
          <div className="mb-8">
            <p className="text-2xl text-gray-700 mb-2">
              This is to certify that
            </p>
            <h2
              className="text-5xl font-bold text-amber-800 my-6 py-4 border-b-2 border-t-2 border-orange-400"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {participant.name}
            </h2>
            <p className="text-2xl text-gray-700 mb-4">
              has successfully participated in
            </p>
            <h3
              className="text-4xl font-bold text-orange-600 mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Yogi Vemana Jayanti Celebration
            </h3>
          </div>

          {/* Quote */}
          <div className="mb-10 max-w-3xl">
            <p className="text-xl italic text-gray-600 border-l-4 border-orange-400 pl-4">
              "Knowledge is the supreme wealth among all treasures"
            </p>
            <p className="text-sm text-orange-700 mt-2 font-semibold">
              - Yogi Vemana
            </p>
          </div>

          {/* Date and Signature Section */}
          <div className="flex justify-between items-end w-full max-w-4xl mt-8">
            <div className="text-left">
              <p className="text-gray-600 text-lg mb-2">Date</p>
              <p className="text-xl font-semibold text-gray-800 border-t-2 border-gray-800 pt-2">
                {formatDate()}
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-16 flex items-center justify-center mb-2">
                <div
                  className="text-3xl font-bold text-orange-600"
                  style={{ fontFamily: "Brush Script MT, cursive" }}
                >
                  Organizer
                </div>
              </div>
              <div className="border-t-2 border-gray-800 pt-2">
                <p className="text-gray-600 text-lg">Authorized Signature</p>
              </div>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="absolute bottom-16 right-20 text-right">
            <p className="text-sm text-gray-500">
              Certificate ID: YVJ-{participant.id}-2026
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-12 text-orange-200 text-6xl opacity-20">
          ❋
        </div>
        <div className="absolute top-1/3 right-12 text-amber-200 text-6xl opacity-20">
          ❋
        </div>
        <div className="absolute bottom-1/4 left-16 text-orange-200 text-5xl opacity-20">
          ✿
        </div>
        <div className="absolute bottom-1/3 right-16 text-amber-200 text-5xl opacity-20">
          ✿
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
