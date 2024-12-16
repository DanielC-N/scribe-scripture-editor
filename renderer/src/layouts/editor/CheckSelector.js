import React, { useState } from "react";
import packageInfo from '../../../../package.json';
import AdjustmentsVerticalIcon from '@/icons/Common/AdjustmentsVertical.svg';
import md5 from 'md5';
// import * as fs from 'node:fs/promises';
// import path from "path";

const checksData = [
  {
    name: "versestats::verse_stats",
    description: "Checks for empty, short and long verses",
    level: "minor",
    contentType: "perf",
    children: [],
  },
  {
    name: "chapterverse::duplicate_chapters",
    description: "Checks for duplicate chapter numbers",
    level: "major",
    contentType: "perf",
    children: [],
  },
  {
    name: "chapterverse::duplicate_verses",
    description: "Checks for duplicate verse numbers",
    level: "major",
    contentType: "perf",
    children: [],
  },
  {
    name: "chapterverse::missing_chapters",
    description: "Checks for missing chapter numbers",
    level: "minor",
    contentType: "perf",
    children: [],
  },
  {
    name: "chapterverse::missing_verses",
    description: "Checks for missing verse numbers within chapters",
    level: "major",
    contentType: "perf",
    children: [],
  },
  {
    name: "chapterverse::out_of_order_chapters",
    description: "Checks for out-of-order chapter numbers within chapters",
    level: "major",
    contentType: "perf",
    children: [],
  },
  {
    name: "chapterverse::out_of_order_verses",
    description: "Checks for out-of-order verse numbers within chapters",
    level: "major",
    contentType: "perf",
    children: [],
  },
];

const CheckSelector = ({ showResourcesPanel, setChoosingSourceLang }) => {
  const [selectedChecks, setSelectedChecks] = useState([]);

  const writeJSONToFile = (updatedChecks) => {
    const fs = window.require('fs');
    const path = require('path');
    const generatedJSON = {
      name: "Scribe checks",
      description: "",
      checks: checksData.filter((check) => updatedChecks.includes(check.name)),
    };

    const newpath = localStorage.getItem('userPath');
    console.log("newpath ==", newpath);
    const projectsPath = path.join(newpath, packageInfo.name, 'config_checks.json');

    const filePath = projectsPath;
    try {
      fs.writeFileSync(filePath, JSON.stringify(generatedJSON, null, 2), "utf8");
    } catch (error) {
      console.error("Error writing file:", error);
    }
  };

  const handleCheckToggle = (checkName) => {
    setSelectedChecks((prev) => {
      const updatedChecks = prev.includes(checkName)
        ? prev.filter((name) => name !== checkName)
        : [...prev, checkName];
      writeJSONToFile(updatedChecks);
      return updatedChecks;
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-primary mb-4">Checks Selector</h1>
      <button
        onClick={showResourcesPanel}
        className="bg-primary mb-4 flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:bg-gray-200 hover:text-primary shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        <AdjustmentsVerticalIcon className="h-5 w-5" />
        <span>Choose source language resource</span>
      </button>
      <div className="space-y-2">
        {checksData.map((check) => (
          <label
            key={check.name}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary"
              checked={selectedChecks.includes(check.name)}
              onChange={() => handleCheckToggle(check.name)}
            />
            <span className="text-sm text-gray-700">{check.description}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckSelector;
