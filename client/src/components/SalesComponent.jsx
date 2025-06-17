import React from 'react'

const SalesComponent = ({ title, value, icon: Icon, bgColor }) => {
  return (
    <div className={`rounded-xl p-5 text-white shadow-lg ${bgColor} `}>
      <div className="flex items-center justify-between">
        
        {/* Icon with semi-transparent background */}
        <div className="rounded-lg bg-red- bg-opacity-30 p-3">
          <Icon className="h-7 w-7" />
        </div>
        
        {/* Text content */}
        <div className="">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm opacity-90">{title}</p>
        </div>

      </div>
    </div>
  );

}

export default SalesComponent