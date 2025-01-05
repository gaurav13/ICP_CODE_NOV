import React, { useEffect, useState } from "react";
import { makeEntryActor } from "@/dfx/service/actor-locator";
import { Spinner } from "react-bootstrap";
import Link from "next/link";
import { DIRECTORY_STATIC_PATH, DIRECTORY_DINAMIC_PATH } from "@/constant/routes";

type DirectoryDetailProps = {
  directoryId: string;
};

type Directory = {
  companyLogo?: string;
  company?: string;
  shortDescription?: string;
  isStatic?: boolean; // Add flag to determine the type of directory
};

const DirectoryDetailComponent: React.FC<DirectoryDetailProps> = ({ directoryId }) => {
  const [directory, setDirectory] = useState<Directory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDirectoryData = async (id: string): Promise<void> => {
    try {
      console.log("Directory ID being fetched:", id);
      const entryActor = makeEntryActor();
      const data = await entryActor.getWeb3(id);

      console.log("API Response for getWeb3:", data);

      if (data && data[0]) {
        const directoryData: Directory = data[0];
        console.log("Mapped Directory Data:", directoryData);
        setDirectory(directoryData);
      } else {
        console.error("No valid data found for directory ID:", id);
      }
    } catch (error) {
      console.error("Error fetching directory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (directoryId) {
      fetchDirectoryData(directoryId);
    }
  }, [directoryId]);

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (!directory) {
    return <div>No directory information available</div>;
  }

  // Construct link based on directory type
  const directoryLink = directory.isStatic
    ? `${DIRECTORY_STATIC_PATH}${directoryId}`
    : `${DIRECTORY_DINAMIC_PATH}${directoryId}`;

  return (
    <div
      className="company-detail-card d-flex align-items-center"
      style={{ padding: "10px",borderRadius: "5px" }}
    >
      {/* Company Logo */}
      <div
        className="company-logo"
        style={{
          marginRight: "10px",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: "0",
        }}
      >
        {directory.companyLogo ? (
          <img 
            src={directory.companyLogo}
            alt={directory.company || "Company Logo"}
            style={{
              width: "100%",
              height: "auto",
            }}
            className="img-fluid rounded-circle"
          />
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "#888",
            }}
          >
            No Logo
          </div>
        )}
      </div>

      {/* Company Name and Description */}
      <div className="company-info">
        <Link href={directoryLink}>
          <span
            className="company-name mb-1"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#007bff",
              textDecoration: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
            }}
            title={directory.company || "No Name Available"}
          >
            {directory.company || "Unknown Company"}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default DirectoryDetailComponent;
