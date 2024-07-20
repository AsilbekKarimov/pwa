import React, { useEffect, useState } from "react";

function App() {
  const [product, setProduct] = useState([]);
  const [loading, setloading] = useState(true);
  let token = "7141536701:AAEzVqH5ymIR41yxmVGNI8Ynic2jrw88gWc";
  let CHAT_ID = "954780945";

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", "night");
  }, []);

  const getProduct = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products`);
      const data = await response.json();
      console.log("API Data:", data);
      setProduct(data.products); 
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setloading(false);
    }
  };
  

  const addToBasket = (product) => {
    sendMessage(`Product Added to Basket: 
    Price: $${product.price}
    Image: ${product.thumbnail}
    `);
  };

  const sendMessage = async (message) => {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
          }),
        }
      );
      const data = await response.json();
      console.log("Message sent succesfully: ", data);
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <div className="h-screen flex justify-center items-center">
            <span className="loading loading-infinity loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-[3%] gap-y-10 p-10">
            {product.map((item, id) => (
              <div
                key={id}
                className="bg-base-300 flex-1 min-w-[22%] w-full rounded-lg shadow-lg shadow-primary"
              >
                <img src={item.thumbnail} className="w-full" alt="img" />
                <div className="p-3">
                  <p className="text-primary">{item.title}</p>
                  <p className="text-primary">{item.price}</p>
                  <button
                    className="btn btn-accent w-full"
                    onClick={() => addToBasket(item)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
  
}

export default App;
