import ProductCard from "../Catalog/ProductCard";
import HighlightedText from "../../common/HighlightedText";

function Products({ products }) {
  return (
    <div className="w-full mt-20 ">
      <HighlightedText text={"Popular Products"}/>
      <div className="products text-white grid  max-[445px]:justify-items-center grid-cols-1 min-[445px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 overflow-hidden mt-10">
        {products?.length ? (
          products.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))
        ) : (
          <p style={{ color: "white" }}>No Data found</p>
        )}
      </div>
    </div>
  );
}

export default Products;
