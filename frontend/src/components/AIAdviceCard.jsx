// import { motion } from "framer-motion";

// const AIAdviceCard = ({ advice, confidence, priority, aiPowered, onGetRecommendation, loading }) => {
//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 border-red-300 text-red-800';
//       case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
//       case 'low': return 'bg-green-100 border-green-300 text-green-800';
//       default: return 'bg-blue-100 border-blue-300 text-blue-800';
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-lg p-6"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//           {aiPowered ? "🤖" : "💡"} AI Irrigation Advice
//         </h3>
//         {confidence && (
//           <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
//             {confidence} Confidence
//           </span>
//         )}
//       </div>
      
//       <p className="text-gray-600 mb-4">{advice}</p>
      
//       <div className="flex justify-between items-center">
//         <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(priority)}`}>
//           {priority?.toUpperCase()} PRIORITY
//         </span>
        
//         {aiPowered && onGetRecommendation && (
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onGetRecommendation}
//             disabled={loading}
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Analyzing...
//               </>
//             ) : (
//               <>
//                 <span>🔍</span>
//                 Get New Analysis
//               </>
//             )}
//           </motion.button>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default AIAdviceCard;

// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// const AIAdviceCard = ({ sensorData, aiPowered, onGetRecommendation, loading }) => {
//   const [advice, setAdvice] = useState("Waiting for live data...");
//   const [priority, setPriority] = useState("low");
//   const [confidence, setConfidence] = useState(null);

//   // Automatically update advice based on soil moisture and status
//   useEffect(() => {
//     if (!sensorData || sensorData.soilMoisture == null) {
//       setAdvice("Waiting for live data...");
//       setPriority("low");
//       setConfidence(null);
//       return;
//     }

//     const moisture = sensorData.soilMoisture;
//     let newAdvice = "";
//     let newPriority = "";
//     let newConfidence = "95%";

//     if (moisture < 40) {
//       newAdvice = "💧 Soil is dry — irrigation needed!";
//       newPriority = "high";
//     } else if (moisture >= 40 && moisture <= 70) {
//       newAdvice = "🌿 Soil moisture is optimal — no irrigation needed.";
//       newPriority = "medium";
//     } else {
//       newAdvice = "☔ Soil is too wet — stop irrigation.";
//       newPriority = "low";
//     }

//     setAdvice(newAdvice);
//     setPriority(newPriority);
//     setConfidence(newConfidence);
//   }, [sensorData]);

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 border-red-300 text-red-800';
//       case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
//       case 'low': return 'bg-green-100 border-green-300 text-green-800';
//       default: return 'bg-blue-100 border-blue-300 text-blue-800';
//     }
//   };



//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-lg p-6"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//           {aiPowered ? "🤖" : "💡"} AI Irrigation Advice
//         </h3>
//         {confidence && (
//           <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
//             {confidence} Confidence
//           </span>
//         )}
//       </div>

//       <p className="text-gray-600 mb-4">{advice}</p>

//       <div className="flex justify-between items-center">
//         <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(priority)}`}>
//           {priority?.toUpperCase()} PRIORITY
//         </span>

//         {aiPowered && onGetRecommendation && (
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onGetRecommendation}
//             disabled={loading}
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Analyzing...
//               </>
//             ) : (
//               <>
//                 <span>🔍</span>
//                 Get New Analysis
//               </>
//             )}
//           </motion.button>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default AIAdviceCard;


import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AIAdviceCard = ({ sensorData, aiPowered, onGetRecommendation, loading }) => {
  const [advice, setAdvice] = useState("Waiting for live data...");
  const [priority, setPriority] = useState("low");
  const [confidence, setConfidence] = useState(null);

  // 🌿 Auto-update advice from sensor data
  useEffect(() => {
    if (!sensorData || sensorData.soilMoisture == null) {
      setAdvice("Waiting for live data...");
      setPriority("low");
      setConfidence(null);
      return;
    }

    const moisture = sensorData.soilMoisture;
    let newAdvice = "";
    let newPriority = "";
    let newConfidence = "95%";

    if (moisture < 40) {
      newAdvice = "💧 Soil is dry — start irrigation.";
      newPriority = "high";
    } else if (moisture >= 40 && moisture <= 70) {
      newAdvice = "🌿 Soil moisture is optimal — stop irrigation.";
      newPriority = "medium";
    } else {
      newAdvice = "☔ Soil is too wet — stop irrigation.";
      newPriority = "low";
    }

    setAdvice(newAdvice);
    setPriority(newPriority);
    setConfidence(newConfidence);
  }, [sensorData]);

  // 🚰 Automatically control irrigation hardware
  useEffect(() => {
    if (!advice) return;

    if (advice.toLowerCase().includes("start irrigation")) {
      fetch("http://localhost:3002/api/irrigation/start", { method: "POST" });
    } else if (advice.toLowerCase().includes("stop irrigation")) {
      fetch("http://localhost:3002/api/irrigation/stop", { method: "POST" });
    }
  }, [advice]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 border-red-300 text-red-800";
      case "medium":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "low":
        return "bg-green-100 border-green-300 text-green-800";
      default:
        return "bg-blue-100 border-blue-300 text-blue-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {aiPowered ? "🤖" : "💡"} AI Irrigation Advice
        </h3>
        {confidence && (
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
            {confidence} Confidence
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-4">{advice}</p>

      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(priority)}`}
        >
          {priority?.toUpperCase()} PRIORITY
        </span>

        {aiPowered && onGetRecommendation && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetRecommendation}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <span>🔍</span>
                Get New Analysis
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default AIAdviceCard;
