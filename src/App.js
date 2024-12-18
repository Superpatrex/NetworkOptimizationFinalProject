import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from 'three';
import { NODES, EDGES } from './constants.js';
import './App.css';

// Generate a large number of nodes and links
const generateGraphData = () => {
  const nodes = NODES;
  const links = EDGES;
  return { nodes, links };
};

const App = () => {
  const tooltipRef = useRef();
  const graphRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);

  const graphData = useMemo(() => generateGraphData(), []);

  const handleNodeHover = (node) => {
    setHoveredNode(node);
    if (node) {
      const partitionString = getParititionString(node.partition);
      tooltipRef.current.style.display = "block";
      tooltipRef.current.innerHTML = `
        <strong>${node.name}</strong><br/>
        <em>ID:</em> ${node.id}<br/>
        <em>Partition:</em> ${partitionString}<br/>
        <em>Total Edges:</em> ${node.num_edges}<br/>
        <em>Bruh </br>
        <em>Rank:</em> ${node.rank}<br/>
        <em>PageRank:</em> ${node.page_rank}<br/>
        <em>Hubs:</em> ${node.hubs}<br/>
        <em>Authorities:</em> ${node.authorities}<br/>
      `;
    } 
    else 
    {
      tooltipRef.current.style.display = "none";
    }
  };

  const getParititionString = (partition) => {
    switch (partition) {
      case 0: return "Nixon Era";
      case 1: return "Clinton Era";
      case 2: return "Carter/Reagan/H. W. Bush Era";
      case 3: return "Bush Era";
      case 4: return "Obama Era";
      case 5: return "Trump Era";
      case 6: return "Biden Era";
      default: return "Unknown Era";
    }
  };

  const handleNodeClick = useCallback((node) => {
    if (node && node.url) {
      window.open(node.url, '_blank');
    }
  }, []);

  const interpolateColor = (partition) => {
    switch (partition) {
      case 0: return 0xFFB3B3;
      case 1: return 0xB3FFB3;
      case 2: return 0xB3B3FF;
      case 3: return 0xFFD9B3;
      case 4: return 0xFFB3DE;
      case 5: return 0xB3FFFF;
      case 6: return 0xFFFFB3;
      default: return 0xFFFFFF;
    }
  };

  const nodeThreeObject = useCallback((node) => {
    const minSize = 0; 
    const maxSize = 300;
    
    // Color based on partition
    const color = interpolateColor(node.partition);
    
    // Unique geometry for President
    const geometry = !node.is_president
      ? new THREE.SphereGeometry(Math.log2(node.size))
      : new THREE.SphereGeometry(Math.log2(node.size) * 2);
    
    // Unique material for President
    const material =  new THREE.MeshBasicMaterial({ color });
    
    return new THREE.Mesh(geometry, material);
  }, []);

  const linkColor = useCallback((link) => 
  {
    if (hoveredNode && (link.source.id === hoveredNode.id || link.target.id === hoveredNode.id)) 
    {
      return 'rgba(255, 255, 255, 1.0)';
    }
    return 'rgba(255, 255, 255, 0.5)';
  }, [hoveredNode]);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          pointerEvents: "none",
          display: "none",
        }}
      ></div>

      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        nodeLabel={(node) => 
          `<div class="tooltip-text">
            <strong>${node.name}</strong><br/>
            <em>ID:</em> ${node.id}<br/>
            <em>Partition:</em> ${getParititionString(node.partition)}<br/>
            <em>Total Edges:</em> ${node.num_edges}<br/>
            <em>Rank:</em> ${node.rank}<br/>
            <em>PageRank:</em> ${node.page_rank}<br/>
            <em>Hubs:</em> ${node.hubs}<br/>
            <em>Authorities:</em> ${node.authorities}<br/>
          </div>`}
        linkWidth={1}
        linkColor={linkColor}
        enableZoomInteraction
        enablePanInteraction
        cooldownTicks={0}
        warmupTicks={100}
        nodeResolution={1}
        nodeThreeObject={nodeThreeObject}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          background: "rgba(0, 0, 0, 0.9)",
          padding: "20px", // Increased padding
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          fontSize: "1.5em",
          color: "white",
        }}
      >
        <strong>Legend</strong><br/>
        <span style={{ color: "#FFB3B3" }}>■</span> Nixon Era<br/>
        <span style={{ color: "#FFFFB3" }}>■</span> Carter/Reagan/H. W. Bush Era<br/>
        <span style={{ color: "#B3B3FF" }}>■</span> Clinton Era<br/>
        <span style={{ color: "#B3FFB3" }}>■</span> Bush Era<br/>
        <span style={{ color: "#FFD9B3" }}>■</span> Obama Era<br/>
        <span style={{ color: "#B3FFFF" }}>■</span> Biden Era<br/>
        <span style={{ color: "#FFB3DE" }}>■</span> Trump Era<br/>
      </div>
    </div>
    
  );
};

export default React.memo(App);