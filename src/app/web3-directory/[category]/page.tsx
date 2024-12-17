import { CATEGORY_MAP } from "@/constant/directorycategoryMap";
import ClientCategoryPage from "@/components/DirectoryCategory/ClientCategoryPage";
import { makeEntryActor } from "@/dfx/service/actor-locator";

// Validate CATEGORY_MAP
if (!CATEGORY_MAP || typeof CATEGORY_MAP !== "object") {
  throw new Error("CATEGORY_MAP is invalid or not properly defined.");
}

// Generate static params for all categories
export async function generateStaticParams() {
  try {
    return Object.keys(CATEGORY_MAP).map((category) => ({
      category,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Fetch category data during build
async function fetchCategoryData(categoryId) {
  try {
    if (process.env.NODE_ENV === "production") {
      const entryActor = makeEntryActor({ agentOptions: {} });
      const response = await entryActor.get_category(categoryId);

      if (response && typeof response === "object") {
        return {
          description: response.categoryDescription || "",
          logo: response.logo || "",
          banner: response.banner || "",
        };
      } else {
        console.warn("Invalid response format for category ID:", categoryId, response);
      }
    }
  } catch (error) {
    console.error(`Error fetching category data for ID ${categoryId}:`, error);
  }

  // Return fallback data
  return { description: "No description available", logo: "", banner: "" };
}

// Static rendering of the page
export default async function DynamicCategoryPage({ params }) {
  try {
    const categoryId = CATEGORY_MAP[params.category];

    if (!categoryId) {
      console.warn(`Invalid category: ${params.category}`);
      return <div>Invalid category</div>;
    }

    const categoryData = await fetchCategoryData(categoryId);

    return (
      <ClientCategoryPage
        categoryId={categoryId}
        category={params.category}
        categoryData={categoryData}
      />
    );
  } catch (error) {
    console.error("Error rendering DynamicCategoryPage:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
}
