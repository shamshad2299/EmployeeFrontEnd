import React from "react";


const SummaryCard = ({ msg, color, number ,icon  ,rup}) => {
  return (
    <div>
      <div className=" mt-4 flex-wrap">
        <div className={`flex bg-white mx-4 lg:w-98 w-48 h-18 rounded-sm shadow-md`}>
          <div className={`${color} p-2 h-full w-18 text-5xl  text-white`} >
                {icon}
            </div>
          <span className="text-sm font-semibold ml-2">
            {msg}
            <p className="mt-2">{number} {rup}</p>
          </span>
        </div>
    
      </div>
    </div>
  );
};

export default SummaryCard;
