import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomLoadingPage from "../../Utils/CustomLoadingPage";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CartGrid from "../CartGrid/CartGrid";

const Cart = () => {
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const consumer = useSelector((state) => state.consumer);

  const getFileNameWithoutExtension = (url) => {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    return fileName.replace(".pdf", "");
  };

  if (!initialized) {
    return <CustomLoadingPage />;
  }

  if (consumer.loading) {
    return <CustomLoadingPage />;
  }
  return (
    <div className="p-6 min-h-screen flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🛒 My Cart</h1>
      {
        consumer.cartItems && consumer.cartItems.length==0 ? (
            <div className="flex flex-col items-center mt-10 text-gray-500">
            <ShoppingCartOutlinedIcon fontSize="large" className="mb-2 text-gray-400" />
            <p className="text-lg">Your cart is empty.</p>
          </div>

        ):(
            <CartGrid data={consumer.cartItems}/>
        )
      }
    </div>
  );
};

export default Cart;
