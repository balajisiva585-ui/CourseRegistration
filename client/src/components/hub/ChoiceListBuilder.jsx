import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Building,
  Sparkles,
  Search,
  CheckCircle2,
  Layers,
  AlertCircle,
} from 'lucide-react';

export const ChoiceListBuilder = ({
  preferences = [],
  onPreferencesChange,
  allColleges = [],
  allDepartments = [],
}) => {
  const [selectedCollegeCode, setSelectedCollegeCode] = useState('');
  const [selectedDeptCode, setSelectedDeptCode] = useState('');
  const [selectedQuota, setSelectedQuota] = useState('Government');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddChoice = (e) => {
    e.preventDefault();
    if (!selectedCollegeCode || !selectedDeptCode) return;

    const college = allColleges.find((c) => c.code === selectedCollegeCode);
    const dept = allDepartments.find((d) => d.code === selectedDeptCode);

    if (!college || !dept) return;

    // Check if already in preferences
    const isDuplicate = preferences.some(
      (p) => p.collegeCode === college.code && p.departmentCode === dept.code && p.quota === selectedQuota
    );
    if (isDuplicate) {
      alert('This college and branch choice is already in your preference list.');
      return;
    }

    const newChoice = {
      priority: preferences.length + 1,
      collegeCode: college.code,
      collegeName: college.name,
      district: college.district,
      collegeType: college.collegeType,
      departmentCode: dept.code,
      departmentName: dept.name,
      quota: selectedQuota,
    };

    onPreferencesChange([...preferences, newChoice]);
    setSelectedDeptCode('');
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...preferences];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;

    // Re-index priorities
    const reindexed = updated.map((item, i) => ({ ...item, priority: i + 1 }));
    onPreferencesChange(reindexed);
  };

  const handleMoveDown = (index) => {
    if (index === preferences.length - 1) return;
    const updated = [...preferences];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;

    // Re-index priorities
    const reindexed = updated.map((item, i) => ({ ...item, priority: i + 1 }));
    onPreferencesChange(reindexed);
  };

  const handleRemove = (index) => {
    const updated = preferences.filter((_, i) => i !== index);
    const reindexed = updated.map((item, i) => ({ ...item, priority: i + 1 }));
    onPreferencesChange(reindexed);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all choices in your preference order?')) {
      onPreferencesChange([]);
    }
  };

  const applyPreset = (presetType) => {
    let presetChoices = [];

    if (presetType === 'top_tier_cse') {
      presetChoices = [
        { priority: 1, collegeCode: '0001', collegeName: 'College of Engineering, Guindy (CEG), Anna University', district: 'Chennai', collegeType: 'University', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
        { priority: 2, collegeCode: '0001', collegeName: 'College of Engineering, Guindy (CEG), Anna University', district: 'Chennai', collegeType: 'University', departmentCode: 'AD', departmentName: 'Artificial Intelligence & Data Science', quota: 'Government' },
        { priority: 3, collegeCode: '0004', collegeName: 'Madras Institute of Technology (MIT), Anna University', district: 'Chennai', collegeType: 'University', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
        { priority: 4, collegeCode: '2006', collegeName: 'PSG College of Technology', district: 'Coimbatore', collegeType: 'Government Aided', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
        { priority: 5, collegeCode: '2006', collegeName: 'PSG College of Technology', district: 'Coimbatore', collegeType: 'Government Aided', departmentCode: 'AD', departmentName: 'Artificial Intelligence & Data Science', quota: 'Government' },
        { priority: 6, collegeCode: '1315', collegeName: 'Sri Sivasubramaniya Nadar (SSN) College of Engineering', district: 'Chengalpattu', collegeType: 'Autonomous', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
        { priority: 7, collegeCode: '5008', collegeName: 'Thiagarajar College of Engineering (TCE)', district: 'Madurai', collegeType: 'Government Aided', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
        { priority: 8, collegeCode: '2007', collegeName: 'Coimbatore Institute of Technology (CIT)', district: 'Coimbatore', collegeType: 'Government Aided', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
      ];
    } else if (presetType === 'coimbatore_hub') {
      presetChoices = [
        { priority: 1, collegeCode: '2006', collegeName: 'PSG College of Technology', district: 'Coimbatore', collegeType: 'Government Aided', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
        { priority: 2, collegeCode: '2006', collegeName: 'PSG College of Technology', district: 'Coimbatore', collegeType: 'Government Aided', departmentCode: 'AD', departmentName: 'Artificial Intelligence & Data Science', quota: 'Government' },
        { priority: 3, collegeCode: '2007', collegeName: 'Coimbatore Institute of Technology (CIT)', district: 'Coimbatore', collegeType: 'Government Aided', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
        { priority: 4, collegeCode: '2005', collegeName: 'Government College of Technology (GCT)', district: 'Coimbatore', collegeType: 'Government', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
        { priority: 5, collegeCode: '2712', collegeName: 'Kumaraguru College of Technology (KCT)', district: 'Coimbatore', collegeType: 'Autonomous', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
        { priority: 6, collegeCode: '2718', collegeName: 'Sri Krishna College of Engineering & Technology (SKCET)', district: 'Coimbatore', collegeType: 'Autonomous', departmentCode: 'CS', departmentName: 'Computer Science & Engineering', quota: 'Government' },
      ];
    }

    onPreferencesChange(presetChoices);
  };

  const filteredColleges = (allColleges || []).filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.code && String(c.code).toLowerCase().includes(term)) ||
      (c.district && c.district.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      {/* Top Header & Presets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            TNEA Choice Preference List ({preferences.length} Selected)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem', margin: 0 }}>
            Order your choices in priority sequence (1 to {Math.max(preferences.length, 20)}). The simulation evaluates choices in this exact sequence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => applyPreset('top_tier_cse')}
            style={{
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ⚡ Auto-Fill Top CSE Combo
          </button>
          <button
            type="button"
            onClick={() => applyPreset('coimbatore_hub')}
            style={{
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ⚡ Coimbatore Hub Preset
          </button>
          {preferences.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fca5a5',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Add New Preference Form */}
      <form
        onSubmit={handleAddChoice}
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.15rem',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
          gap: '0.75rem',
          alignItems: 'flex-end',
        }}
      >
        {/* College Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
            1. Select College:
          </label>
          <select
            value={selectedCollegeCode}
            onChange={(e) => setSelectedCollegeCode(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#ffffff' }}
          >
            <option value="">-- Choose College --</option>
            {allColleges.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.shortName || c.name} ({c.district})
              </option>
            ))}
          </select>
        </div>

        {/* Branch Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
            2. Select Branch:
          </label>
          <select
            value={selectedDeptCode}
            onChange={(e) => setSelectedDeptCode(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#ffffff' }}
          >
            <option value="">-- Choose Branch --</option>
            {allDepartments.map((d) => (
              <option key={d.code} value={d.code}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quota Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
            3. Admission Quota:
          </label>
          <select
            value={selectedQuota}
            onChange={(e) => setSelectedQuota(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#ffffff' }}
          >
            <option value="Government">Government / TNEA Single Window</option>
            <option value="Management">Management Quota Direct</option>
          </select>
        </div>

        {/* Add Button */}
        <button
          type="submit"
          disabled={!selectedCollegeCode || !selectedDeptCode}
          style={{
            backgroundColor: selectedCollegeCode && selectedDeptCode ? '#2563eb' : '#94a3b8',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.55rem 1.25rem',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: selectedCollegeCode && selectedDeptCode ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            height: '38px',
          }}
        >
          <Plus size={16} />
          <span>Add Choice</span>
        </button>
      </form>

      {/* Ordered Choice List */}
      {preferences.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
          <Layers size={36} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
          <h4 style={{ margin: '0 0 0.25rem', color: '#0f172a' }}>Your Preference List is Empty</h4>
          <p style={{ fontSize: '0.85rem', margin: '0 0 1rem' }}>
            Add at least 3-5 college and branch choices above or click an Auto-Fill preset to simulate your allotment.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {preferences.map((item, index) => (
            <div
              key={`${item.collegeCode}-${item.departmentCode}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                {/* Priority Badge */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  #{item.priority}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      {item.collegeName}
                    </span>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      Code: {item.collegeCode}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    <span style={{ color: '#059669', fontWeight: 700 }}>
                      Branch: {item.departmentName} ({item.departmentCode})
                    </span>
                    <span>• {item.district}</span>
                    <span>• {item.quota} Quota</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Move Up, Move Down, Delete */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    opacity: index === 0 ? 0.4 : 1,
                  }}
                  title="Move choice up"
                >
                  <ArrowUp size={15} color="#334155" />
                </button>

                <button
                  type="button"
                  disabled={index === preferences.length - 1}
                  onClick={() => handleMoveDown(index)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    cursor: index === preferences.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: index === preferences.length - 1 ? 0.4 : 1,
                  }}
                  title="Move choice down"
                >
                  <ArrowDown size={15} color="#334155" />
                </button>

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  style={{
                    backgroundColor: '#fee2e2',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    cursor: 'pointer',
                  }}
                  title="Remove from choices"
                >
                  <Trash2 size={15} color="#dc2626" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChoiceListBuilder;
