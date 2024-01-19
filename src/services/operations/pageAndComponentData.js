import { apiConnector } from "../apiconnector";
import { catalogData } from "../apis";

// =============== CATALOG DATA ================
export const getCatalogPageData = async (
  categoryId,
  page = 1,
  pageSize = 10
) => {
  let result = [];
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOG_PAGE_DATA_API,
      { categoryId, page, pageSize }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    result = response?.data;
  } catch (error) {
    console.log("CATALOG PAGE DATA ERROR ====>", error);
    // toast.error(error.message);
    result = error.message;
  }
  return result;
};
