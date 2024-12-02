import React from "react";
import { CATEGORY_MAP } from "@/constant/directorycategoryMap";
import ClientCategoryPage from "@/components/DirectoryCategory/ClientCategoryPage";
import { makeEntryActor } from "@/dfx/service/actor-locator";

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((category) => ({
    category,
  }));
}

export default async function DynamicCategoryPage({ params }: { params: { category: string } }) {
  const categoryId = CATEGORY_MAP[params.category];

  if (!categoryId) {
    return <div>Invalid category</div>;
  }

  // Fetch category data
  let categoryData = {
    description: "",
    logo: "",
    banner: "",
  };

  try {
    const entryActor = makeEntryActor({ agentOptions: {} });
    const response = await entryActor.get_category(categoryId);
    if (response) {
      categoryData = {
        description: response.categoryDescription || "",
        logo: response.logo || "",
        banner: response.banner || "",
      };
    }
  } catch (error) {
    console.error("Error fetching category data:", error);
  }

  // Pass the categoryId, category name, and category data to the client component
  return (
    <ClientCategoryPage
      categoryId={categoryId}
      category={params.category}
      categoryData={categoryData} // Pass this as a prop
    />
  );
}