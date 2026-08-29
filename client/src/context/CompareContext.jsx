import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [comparedColleges, setComparedColleges] = useState(() => {
    try {
      const saved = localStorage.getItem('tnea_compared_colleges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tnea_compared_colleges', JSON.stringify(comparedColleges));
    } catch (e) {
      console.warn('Failed to persist comparison state', e);
    }
  }, [comparedColleges]);

  const addCollegeToCompare = (college) => {
    if (comparedColleges.find((c) => c.code === college.code)) {
      return { success: false, message: `${college.name} is already in comparison list.` };
    }
    if (comparedColleges.length >= 4) {
      return { success: false, message: 'You can compare up to 4 colleges at a time.' };
    }
    setComparedColleges((prev) => [...prev, {
      id: college._id || college.id,
      code: college.code,
      name: college.name,
      district: college.district,
      collegeType: college.collegeType,
      logo: college.logo,
    }]);
    return { success: true, message: `${college.name} added to comparison!` };
  };

  const removeCollegeFromCompare = (code) => {
    setComparedColleges((prev) => prev.filter((c) => c.code !== code));
  };

  const clearComparison = () => {
    setComparedColleges([]);
  };

  const isCollegeCompared = (code) => {
    return comparedColleges.some((c) => c.code === code);
  };

  return (
    <CompareContext.Provider
      value={{
        comparedColleges,
        addCollegeToCompare,
        removeCollegeFromCompare,
        clearComparison,
        isCollegeCompared,
        compareCount: comparedColleges.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export default CompareContext;
