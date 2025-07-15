"use client";

import { useEffect, useState } from "react";
import { FiClock } from 'react-icons/fi';
import { HiLightBulb } from 'react-icons/hi';

export default function SmartAdminAssistant() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tipIndex, setTipIndex] = useState(0);
  const [timeZoneIndex, setTimeZoneIndex] = useState(0);

  const proTips = [
    "Assign guards based on client location for optimal response time",
    "Regular guard performance reviews improve service quality",
    "Use analytics to identify peak security demand periods",
    "Maintain a 2:1 guard-to-client ratio for best coverage",
    "Schedule guard rotations to prevent fatigue and maintain alertness"
  ];

  const timeZones = [
    { name: "United States UTC", zone: "UTC", flag: "🇺🇸" },
    { name: "Canada Time", zone: "America/Toronto", flag: "🇨🇦" },
    { name: "India Time", zone: "Asia/Kolkata", flag: "🇮🇳" }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotate tips every 5 seconds
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % proTips.length);
    }, 5000);

    return () => clearInterval(tipTimer);
  }, []);

  // Rotate time zones every 4 seconds
  useEffect(() => {
    const timeZoneTimer = setInterval(() => {
      setTimeZoneIndex((prev) => (prev + 1) % timeZones.length);
    }, 4000);

    return () => clearInterval(timeZoneTimer);
  }, []);





  return (
    <div className="flex flex-col gap-2 lg:gap-4 w-full lg:w-72">
      {/* Current Date & Time */}
      <div className="bg-[#A3A375] rounded-3xl p-3 shadow-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <FiClock className="text-white text-base lg:text-lg" />
          <h3 className="text-sm lg:text-base font-bold text-white">World Time</h3>
        </div>
        <div className="text-center min-h-[40px] lg:min-h-[50px] flex flex-col justify-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-sm lg:text-base">{timeZones[timeZoneIndex].flag}</span>
            <span className="text-xs font-medium text-white/90">{timeZones[timeZoneIndex].name}</span>
          </div>
          <div className="text-lg lg:text-xl font-bold text-white">
            {currentTime.toLocaleTimeString('en-US', { 
              timeZone: timeZones[timeZoneIndex].zone,
              hour12: true,
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="text-xs text-white/80">
            {currentTime.toLocaleDateString('en-US', { 
              timeZone: timeZones[timeZoneIndex].zone,
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex gap-1">
            {timeZones.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === timeZoneIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>



      {/* Pro Tip of the Day */}
      <div className="bg-[#FEB852] rounded-3xl p-3 lg:p-4 shadow-2xl border border-white/10">
        <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
          <HiLightBulb className="text-black text-lg lg:text-xl" />
          <h3 className="text-base lg:text-lg font-bold text-black">Pro Tip</h3>
        </div>
        <div className="text-black/90 text-xs lg:text-sm leading-relaxed min-h-[50px] lg:min-h-[60px] flex items-center">
          {proTips[tipIndex]}
        </div>
        <div className="flex justify-center mt-2 lg:mt-3">
          <div className="flex gap-1">
            {proTips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === tipIndex ? 'bg-black' : 'bg-black/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>


    </div>
  );
} 