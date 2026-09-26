'use client';

import React, { useState } from 'react';
import { DocumentItem } from '@/lib/types';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';

interface DocumentViewerProps {
  document: DocumentItem;
  highlightedField?: string | null;
  onSelectField?: (fieldName: string) => void;
}

export function DocumentViewer({
  document,
  highlightedField,
  onSelectField
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const passesIqa = document.laplacianVarianceScore >= 100;

  return (
    <div
      className={`flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all ${
        fullscreen ? 'fixed inset-4 z-50 bg-slate-950' : 'h-[620px]'
      }`}
    >
      {/* Top Toolbar */}
      <div className="bg-slate-800 text-slate-200 px-4 py-2.5 flex items-center justify-between border-b border-slate-700 shrink-0">
        <div className="flex items-center space-x-3 truncate">
          <span className="font-semibold text-xs text-white truncate max-w-[220px]">
            {document.name}
          </span>

          {/* Edge Blur & IQA Gate Badge (PPT Slide 3) */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
              passesIqa
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                : 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>IQA Var: {document.laplacianVarianceScore}</span>
            <span>({passesIqa ? 'Passes ≥ 100' : 'Retake < 100'})</span>
          </div>

          {document.digiLockerVerified && (
            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-medium border border-blue-800">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              DigiLocker SSO Verified
            </div>
          )}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-400 font-mono w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded"
            title="Rotate 90deg"
            aria-label="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded ml-1"
            title="Toggle Fullscreen"
            aria-label="Toggle fullscreen"
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Spotlight Canvas Preview Area */}
      <div className="flex-1 overflow-auto bg-slate-950/80 p-6 flex items-center justify-center relative select-none">
        <div
          className="relative transition-transform duration-200 shadow-2xl bg-white text-slate-900 rounded-sm origin-center"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            width: '460px',
            minHeight: '600px'
          }}
        >
          {/* Certificate Simulated Layout */}
          <div className="p-8 border-4 border-amber-900/30 m-2 h-full flex flex-col justify-between text-center relative overflow-hidden bg-[#fdfbf7]">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="text-8xl font-black font-serif uppercase tracking-widest text-slate-900">
                GOVT OF INDIA
              </div>
            </div>

            {/* Header */}
            <div className="border-b-2 border-slate-300 pb-3 mb-4">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                सत्य
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 mt-1">
                GOVERNMENT OF INDIA • STATE REVENUE DEPARTMENT
              </h2>
              <h1 className="text-sm font-black text-slate-900 mt-0.5">
                {document.type === 'CASTE_CERTIFICATE'
                  ? 'CERTIFICATE OF SCHEDULED TRIBE (ST)'
                  : document.type === 'INCOME_CERTIFICATE'
                  ? 'ANNUAL INCOME & ASSET CERTIFICATE'
                  : document.type === 'QUALIFYING_SCORECARD'
                  ? 'NATIONAL TESTING AGENCY (NTA) UGC-NET SCORECARD'
                  : 'OFFICIAL ADMISSION & ENROLMENT RECORD'}
              </h1>
              <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                Document Ref: {document.id} • Sovereign DigiLocker Certified
              </p>
            </div>

            {/* Body of Extracted Fields with Spotlight Bounding Boxes */}
            <div className="space-y-3 text-left my-auto text-xs py-2">
              <p className="text-[11px] leading-relaxed text-slate-700">
                This is to certify that the applicant credentials detailed below have been verified
                under the statutory provisions of the Ministry of Tribal Affairs (MoTA).
              </p>

              <div className="space-y-2 border border-slate-200 bg-white/70 p-3 rounded-md">
                {document.extractedFields.map((field, idx) => {
                  const isHighlighted = highlightedField === field.fieldName;
                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectField && onSelectField(field.fieldName)}
                      className={`p-1.5 rounded transition-all cursor-pointer relative ${
                        isHighlighted
                          ? 'bg-blue-100/90 ring-2 ring-blue-600 border border-blue-400 font-bold'
                          : 'hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      {/* Spotlight bounding box badge */}
                      {isHighlighted && (
                        <span className="absolute -top-2.5 right-2 bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded font-mono shadow-xs">
                          Spotlight Focus (LayoutLMv3)
                        </span>
                      )}
                      <div className="flex justify-between items-baseline text-[11px]">
                        <span className="text-slate-500 font-semibold">{field.label}:</span>
                        <span className="text-slate-900 font-bold">{field.value}</span>
                      </div>
                      {field.jaroWinklerScore && (
                        <div className="flex justify-end gap-2 text-[9px] text-slate-500 font-mono mt-0.5">
                          <span>Jaro-Winkler: {Math.round(field.jaroWinklerScore * 100)}%</span>
                          {field.confidence && <span>Conf: {field.confidence}%</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer with Seal & QR Barcode */}
            <div className="border-t-2 border-slate-300 pt-3 flex items-center justify-between mt-4">
              <div className="text-left text-[9px] font-mono text-slate-600">
                <div className="font-bold">E-SEAL: REVENUE DEPT</div>
                <div>Hash: SHA256-49219A982</div>
                <div>Date: {new Date(document.uploadedAt).toLocaleDateString()}</div>
              </div>

              {/* Simulated QR Code Barcode */}
              <div className="w-12 h-12 bg-white p-1 border border-slate-400 rounded flex flex-col justify-between">
                <div className="flex justify-between h-2">
                  <div className="w-2 bg-slate-900" />
                  <div className="w-2 bg-slate-900" />
                </div>
                <div className="w-4 mx-auto h-2 bg-slate-900" />
                <div className="flex justify-between h-2">
                  <div className="w-2 bg-slate-900" />
                  <div className="w-2 bg-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status bar */}
      <div className="bg-slate-800/90 text-slate-300 px-4 py-2 text-[11px] flex items-center justify-between border-t border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span>Click any field to spotlight LayoutLMv3 multimodal alignment.</span>
        </div>
        <div className="text-slate-400 font-mono">
          Size: {document.fileSizeKb} KB • {document.fileName}
        </div>
      </div>
    </div>
  );
}
