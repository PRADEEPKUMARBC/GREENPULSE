// import { motion } from "framer-motion";

// const SensorCard = ({ title, value, optimal, status, icon, aiPrediction }) => {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'optimal': return 'bg-green-100 text-green-800';
//       case 'warning': return 'bg-yellow-100 text-yellow-800';
//       case 'critical': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-green-300 transition-all"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <span className="text-2xl">{icon}</span>
//           <h3 className="font-semibold text-gray-800">{title}</h3>
//         </div>
//         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
//           {status}
//         </span>
//       </div>
      
//       <div className="text-3xl font-bold text-green-700 mb-2">{value}</div>
//       <p className="text-sm text-gray-600 mb-2">Optimal: {optimal}</p>
      
//       {aiPrediction && (
//         <div className="flex items-center gap-2 mt-3 p-2 bg-blue-50 rounded-lg">
//           <span className="text-sm">🤖</span>
//           <span className="text-xs text-blue-700">{aiPrediction}</span>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default SensorCard;


// import { motion } from "framer-motion";

// const SensorCard = ({ 
//   title, 
//   value, 
//   optimal, 
//   status, 
//   icon, 
//   aiPrediction, 
//   liveData = false,
//   description,
//   trend,
//   lastUpdated 
// }) => {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'optimal': return 'bg-green-100 text-green-800 border-green-200';
//       case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'critical': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getStatusBgColor = (status) => {
//     switch (status) {
//       case 'optimal': return 'bg-green-50';
//       case 'warning': return 'bg-yellow-50';
//       case 'critical': return 'bg-red-50';
//       default: return 'bg-gray-50';
//     }
//   };

//   const getTrendIcon = (trend) => {
//     switch (trend) {
//       case 'rising': return '📈';
//       case 'falling': return '📉';
//       case 'stable': return '➡️';
//       case 'high': return '🔥';
//       case 'low': return '❄️';
//       case 'live': return '🔄';
//       default: return '📊';
//     }
//   };

//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       className={`rounded-2xl p-6 border-2 transition-all duration-300 ${getStatusBgColor(status)} ${status === 'critical' ? 'border-red-300' : status === 'warning' ? 'border-yellow-300' : 'border-green-300'}`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <span className="text-2xl">{icon}</span>
//           <div>
//             <h3 className="font-semibold text-gray-800">{title}</h3>
//             {description && (
//               <p className="text-xs text-gray-600 mt-1">{description}</p>
//             )}
//           </div>
//         </div>
        
//         <div className="flex flex-col items-end gap-1">
//           {/* Live Data Indicator */}
//           {liveData && (
//             <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-xs text-green-700 font-medium">LIVE</span>
//             </div>
//           )}
          
//           {/* Status Badge */}
//           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
//             {status?.charAt(0).toUpperCase() + status?.slice(1)}
//           </span>
//         </div>
//       </div>
      
//       {/* Main Value */}
//       <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
      
//       {/* Optimal Range */}
//       <p className="text-sm text-gray-600 mb-3">Optimal: {optimal}</p>
      
//       {/* Trend and Last Updated */}
//       <div className="flex items-center justify-between mb-3">
//         {trend && (
//           <div className="flex items-center gap-1 text-sm text-gray-600">
//             <span>{getTrendIcon(trend)}</span>
//             <span className="capitalize">{trend}</span>
//           </div>
//         )}
        
//         {lastUpdated && (
//           <div className="text-xs text-gray-500">
//             {lastUpdated}
//           </div>
//         )}
//       </div>
      
//       {/* AI Prediction */}
//       {aiPrediction && (
//         <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
//           <span className="text-sm">🤖</span>
//           <span className="text-xs text-blue-700 font-medium">{aiPrediction}</span>
//         </div>
//       )}

//       {/* Live Data Footer */}
//       {liveData && (
//         <div className="mt-3 pt-2 border-t border-gray-200">
//           <div className="text-xs text-gray-500 flex items-center justify-between">
//             <span className="flex items-center gap-1">
//               <span>🔄</span>
//               <span>Real-time from Arduino</span>
//             </span>
//             <span className="flex items-center gap-1">
//               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
//               <span>Active</span>
//             </span>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default SensorCard;


import { motion } from "framer-motion";

const SensorCard = ({ 
  title, 
  value, 
  optimal, 
  status, 
  icon, 
  aiPrediction, 
  liveData = false,
  description,
  trend,
  lastUpdated 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'no-data': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'optimal': return 'bg-green-50 border-green-300';
      case 'warning': return 'bg-yellow-50 border-yellow-300';
      case 'critical': return 'bg-red-50 border-red-300';
      case 'no-data': return 'bg-gray-50 border-gray-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      case 'stable': return '➡️';
      case 'high': return '🔥';
      case 'low': return '❄️';
      case 'live': return '🔄';
      case 'offline': return '🔴';
      default: return '📊';
    }
  };

  const getValueColor = (status) => {
    switch (status) {
      case 'optimal': return 'text-green-700';
      case 'warning': return 'text-yellow-700';
      case 'critical': return 'text-red-700';
      case 'no-data': return 'text-gray-500';
      default: return 'text-gray-700';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-2xl p-6 border-2 transition-all duration-300 ${getStatusBgColor(status)}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {description && (
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          {/* Live Data Indicator */}
          {liveData && (
            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">LIVE</span>
            </div>
          )}
          
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Main Value */}
      <div className={`text-3xl font-bold mb-2 ${getValueColor(status)}`}>
        {value}
      </div>
      
      {/* Optimal Range */}
      <p className="text-sm text-gray-600 mb-3">Optimal: {optimal}</p>
      
      {/* Trend and Last Updated */}
      <div className="flex items-center justify-between mb-3">
        {trend && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>{getTrendIcon(trend)}</span>
            <span className="capitalize">{trend}</span>
          </div>
        )}
        
        {lastUpdated && (
          <div className="text-xs text-gray-500">
            {lastUpdated}
          </div>
        )}
      </div>
      
      {/* AI Prediction */}
      {aiPrediction && (
        <div className={`flex items-center gap-2 p-3 rounded-lg border ${
          status === 'critical' ? 'bg-red-50 border-red-200' :
          status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <span className="text-sm">🤖</span>
          <span className={`text-xs font-medium ${
            status === 'critical' ? 'text-red-700' :
            status === 'warning' ? 'text-yellow-700' :
            'text-blue-700'
          }`}>
            {aiPrediction}
          </span>
        </div>
      )}

      {/* Live Data Footer */}
      {liveData && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 flex items-center justify-between">
            {/* <span className="flex items-center gap-1">
              <span>🔄</span> 
              <span>Real-time from Arduino</span> 
            </span> */}
            {/* <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span></span>
            </span> */}
          </div>
        </div>
      )}

      {/* No Data Footer */}
      {status === 'no-data' && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>🔴</span>
              <span>Waiting for Arduino data</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              <span>Offline</span>
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SensorCard;