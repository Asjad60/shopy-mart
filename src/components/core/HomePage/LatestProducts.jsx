import { Link } from "react-router-dom";
import ProductSlider from "../Catalog/ProductSlider";
import HighlightedText from "../../common/HighlightedText"

const LatestProducts = ({ products }) => {

  return (
    <div className="text-white flex flex-col gap-8 mx-auto">
      <div className="flex justify-between">
       <HighlightedText  text={"Latest Products"}/>
        {products && products.length > 0 && (
          <Link
            to={`/catalog/${products[0]?.category?.name
              ?.split(" ")
              .join("-")
              .toLowerCase()}`}
              className="flex items-center"
          >
            <p className="text-sm text-yellow-400"> View All Products</p>
          </Link>
        )}
      </div>

      <ProductSlider products={products} />

    </div>
  );
};

export default LatestProducts;
