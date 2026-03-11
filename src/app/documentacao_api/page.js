"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

// Use dynamic to disable SSR for SwaggerUI because it depends on window
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocumentacaoApiPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Fetch spec from our API route
    fetch("/api/doc")
      .then((res) => res.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec)
    return <div style={{ padding: "2rem" }}>Carregando documentação...</div>;

  return (
    <div style={{ padding: "2rem", background: "#fff", minHeight: "100vh" }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}
