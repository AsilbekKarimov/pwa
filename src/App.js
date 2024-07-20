import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", "night");
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("API Data:", data);
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
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
      console.log("Message sent successfully: ", data);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <div className="h-screen flex justify-center items-center">
            <span className="loading loading-infinity loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="h-screen flex justify-center items-center">
            <p className="text-error">Error: {error}</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-[3%] gap-y-10 p-10">
            {products.map((item, id) => (
              <div
                key={id}
                className="bg-base-300 flex-1 min-w-[22%] w-full rounded-lg shadow-lg shadow-primary"
              >
                <img src={item.thumbnail} className="w-full" alt="img" />
                <div className="p-3">
                  <p className="text-primary">{item.title}</p>
                  <p className="text-primary">${item.price}</p>
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
