"use client"
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import Select from 'react-select';


const Page = () => {


  const [rows, setRows] = useState([
    { productId: '', quantity: 1 },
  ]);

  const handleProductChange = (index, productId) => {
    const newRows = [...rows];
    newRows[index].productId = productId;
    setRows(newRows);
  };

  const handleQuantityChange = (index, quantity) => {
    const newRows = [...rows];
    newRows[index].quantity = quantity;
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { productId: '', quantity: 1 }]);
    console.log(rows);
  };


  const handleDeleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };




  const [CustomersList, setCustomersList] = useState([]);
  const [ProductList, setProductList] = useState([]);

  const [OrderID, setOrderID] = useState("")
  const [CustomerID, setCustomerID] = useState("")
  const [CustomerName, setCustomerName] = useState("")
  const [CustomerPhone, setCustomerPhone] = useState("")
  const [CustomerEmail, setCustomerEmail] = useState("")


  const [TrackingID, setTrackingID] = useState("")
  const [cost, setCost] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [TrackingStatus, setTrackingStatus] = useState('pending');
  const [courierName, setCourierName] = useState('fedex');


  const [PaymentMode, setPaymentMode] = useState('');
  const [PaymentStatus, setPaymentStatus] = useState('');
  const [PaymentChannel, setPaymentChannel] = useState('');
  const [PaymentDate, setPaymentDate] = useState('');
  const [OrderAmount, setOrderAmount] = useState('');
  const [PaymentID, setPaymentID] = useState("")


  const [SalesChannel, setSalesChannel] = useState("")
  const [Address, setAddress] = useState("")
  const [Pincode, setPincode] = useState("")



  const handleCustomerSelection = (event) => {
    const selectedValue = event.target.value;
    const [selectedCustomerID, selectedCustomerName, selectedCustomerPhone, selectedCustomerEmail] = selectedValue.split(" | ");
    // You can perform additional actions based on the selected customer
    console.log("Selected Customer ID:", selectedCustomerID);
    console.log("Selected Customer Name:", selectedCustomerName);

    setCustomerID(selectedCustomerID);
    setCustomerName(selectedCustomerName)
    setCustomerPhone(selectedCustomerPhone)
    setCustomerEmail(selectedCustomerEmail)

  };



  const [msg, setmsg] = useState("")


  useEffect(() => {
    auth();
    fetch("/api/getCustomer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.customers);
          setCustomersList(data.customers)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    fetch("/api/getProduct", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.products);
          setProductList(data.products);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  function save() {
    const postData =
    {
      OrderID: OrderID,
      CustomerID: CustomerID,
      Products: rows,
      SalesChannel: SalesChannel,
      Address: Address,
      Pincode: Pincode,
      PaymentID: PaymentID,
      TrackingID: TrackingID,
    }
    console.log(postData);
    fetch("/api/addOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function saveTrackingDetails() {
    const postData = {
      TrackingID: TrackingID,
      TrackingCost: cost,
      trackingUrl: trackingUrl,
      TrackingStatus: TrackingStatus,
      TrackingCourier: courierName,
      OrderID: OrderID
    }

    console.log(postData);

    fetch("/api/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const router = useRouter();
  async function auth() {
    const fetch_api = await fetch("/api/auth/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await fetch_api.json();
    if (!data.success) {
      router.push("/login");
    }
  };

  function savePaymentDetails() {
    const postData = {
      OrderID: OrderID,
      PaymentID: PaymentID,
      PaymentMode: PaymentMode,
      PaymentStatus: PaymentStatus,
      PaymentChannel: PaymentChannel,
      PaymentDate: PaymentDate,
      PaymentAmount: OrderAmount
    }

    console.log(postData);

    fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  return (
    <>

      <div className="mt-20">
        <h2 className="mb-5 text-2xl font-bold text-center">Add New Order</h2>
      </div>
      <div className=" max-w-screen mx-auto container mx-auto border border-3 rounded-lg p-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side */}
          <div>
            {!msg ? ("") : (
              <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                {msg}
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select or type Customer ID</label>
              <input type="text" id="countries" onChange={handleCustomerSelection} list="country-list" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              <datalist id="country-list">
                {CustomersList.map((customer) => (
                  <option key={customer._id} value={`${customer.CustomerID} | ${customer.CustomerName} | ${customer.CustomerPhone} | ${customer.CustomerEmail}`} />
                ))}
              </datalist>
            </div>

            <div className="flex space-x-4 mb-5">
              {/* Customer Name and Customer Phone in one line */}
              <div className="flex-1">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Customer Name</label>
                <input disabled value={CustomerName} onChange={(e) => setCustomerName(e.target.value)} type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" required />
              </div>

              <div className="flex-1">
                <label htmlFor="customerPhone" className="block mb-2 text-sm font-medium text-gray-900">Customer Phone</label>
                <input value={CustomerPhone} onChange={(e) => setCustomerPhone(e.target.value)} id="customerPhone" disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>
            </div>

            <div className="flex space-x-4 mb-5">
              {/* Customer Email and Pincode in another line */}
              <div className="flex-1">
                <label htmlFor="customerEmail" className="block mb-2 text-sm font-medium text-gray-900">Customer Email</label>
                <input value={CustomerEmail} onChange={(e) => setCustomerEmail(e.target.value)} type="text" id="customerEmail" disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>

              <div className="w-1/2">
                <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900">Pincode</label>
                <input value={Pincode} onChange={(e) => setPincode(e.target.value)} id="pincode" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>
            </div>


            <div className="mb-5">
              <label htmlFor="sc" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
              <textarea value={Address} onChange={(e) => setAddress(e.target.value)} id="sc" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
            </div>

          </div>

          {/* Right side */}
          <div>
            <div className="flex space-x-4 mb-5">
              {/* Order ID */}
              <div className="flex-1">
                <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">Order ID</label>
                <input value={OrderID} onChange={(e) => setOrderID(e.target.value)} type="text" id="id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
              </div>

              {/* Sales Channel */}
              <div className="flex-1">
                <label htmlFor="sc" className="block mb-2 text-sm font-medium text-gray-900">Sales Channel</label>
                <input value={SalesChannel} onChange={(e) => setSalesChannel(e.target.value)} id="sc" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>
            </div>


            <div className="mb-5 flex space-x-4">
              {/* Tracking ID */}
              <div className="flex-1">
                <label htmlFor="trackingID" className="block mb-2 text-sm font-medium text-gray-900">Tracking ID</label>
                <input disabled value={TrackingID} onChange={(e) => setTrackingID(e.target.value)} id="trackingID" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>

              {/* Tracking Cost */}
              <div className="flex-1">
                <label htmlFor="trackingCost" className="block mb-2 text-sm font-medium text-gray-900">Payment ID</label>
                <input disabled value={PaymentID} onChange={(e) => setPaymentID(e.target.value)} id="trackingCost" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>
            </div>
          </div>




        </div>
        <button onClick={handleAddRow} className="mt-4 bg-blue-500 text-white px-4 py-1 rounded">+</button>

        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border py-2 px-4">Product</th>
              <th className="border py-2 px-4">Quantity</th>
              <th className="border py-2 px-4">Total</th>
              <th className="border py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border py-2 px-4">
                  <select value={row.productId} onChange={(e) => handleProductChange(index, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="" disabled>Select a product</option>
                    {ProductList.map((product) => (
                      <option key={product._id} value={product.ProductID}>{product.ProductID}{" "}|{" "}{product.ProductName}</option>
                    ))}
                  </select>
                </td>
                <td className="border py-2 px-4">
                  <input type="number" value={row.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </td>
                <td className="border py-2 px-4">
                  <input type="text" value={row.quantity * ProductList.find((product) => product.ProductID === row.productId)?.ProductPrice || 0} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </td>
                <td className="border py-2 px-4">
                  <button onClick={() => handleDeleteRow(index)} className="bg-red-500 text-white px-4 py-2 rounded">X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>






        <div className="flex">

          <button data-modal-target="tracking-modal" data-modal-toggle="tracking-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button">
            Add Tracking Details
          </button>
          <button data-modal-target="payment-modal" data-modal-toggle="payment-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button"> Add Payment Details </button>
          <button onClick={save} class="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button">Save & Create Order </button>


        </div>


        <div id="tracking-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow border-4">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 class="text-xl font-semibold text-gray-900">
                  Tracking Details for order
                </h3>
                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="tracking-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-4 md:p-5">
                <form class="space-y-4" action="#">

                  <div>
                    <label for="trackingId" class="block mb-2 text-sm font-medium text-gray-900">Tracking ID</label>
                    <input value={TrackingID} onChange={(e) => setTrackingID(e.target.value)} type="text" name="trackingId" id="trackingId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Tracking ID" required />
                  </div>
                  <div>
                    <label for="cost" class="block mb-2 text-sm font-medium text-gray-900">Cost</label>
                    <input value={cost} onChange={(e) => setCost(e.target.value)} type="text" name="cost" id="cost" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Cost" required />
                  </div>
                  <div>
                    <label for="cost" class="block mb-2 text-sm font-medium text-gray-900">Tracking URL</label>
                    <input value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} type="text" name="cost" id="cost" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Url" required />
                  </div>
                  <div>
                    <label for="status" class="block mb-2 text-sm font-medium text-gray-900">Status</label>
                    <select value={TrackingStatus} onChange={(e) => setTrackingStatus(e.target.value)} name="status" id="status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="delivered">Return</option>
                    </select>
                  </div>

                  <div>
                    <label for="courierName" class="block mb-2 text-sm font-medium text-gray-900">Courier Name</label>
                    <select value={courierName} onChange={(e) => setCourierName(e.target.value)} name="courierName" id="courierName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="fedex">FedEx</option>
                      <option value="ekart">EKART</option>
                      <option value="dhl">DHL</option>
                      <option value="bluedart">BlueDart</option>
                    </select>
                  </div>
                  {!msg ? ("") : (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                      {msg}
                    </div>
                  )}
                  <button onClick={saveTrackingDetails} type="button" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Tracking Details</button>

                </form>
              </div>
            </div>
          </div>
        </div>




        <div id="payment-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow border-4">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 class="text-xl font-semibold text-gray-900"> Payment Details for order </h3>
                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="payment-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-4 md:p-5">
                <form class="space-y-4" action="#">
                  <div>
                    <label for="orderID" class="block mb-2 text-sm font-medium text-gray-900">Payment ID</label>
                    <input value={PaymentID} onChange={(e) => setPaymentID(e.target.value)} type="text" name="orderID" id="orderID" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Order ID" required />
                  </div>
                  <div>
                    <label for="paymentMode" class="block mb-2 text-sm font-medium text-gray-900">Payment Mode</label>
                    <select value={PaymentMode} onChange={(e) => setPaymentMode(e.target.value)} name="paymentMode" id="paymentMode" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>

                      <option value="" disabled>Select</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="credit_card">Cash</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="debit_card">UPI</option>
                      <option value="net_banking">Net Banking</option>
                    </select>
                  </div>

                  <div>
                    <label for="paymentMode" class="block mb-2 text-sm font-medium text-gray-900">Payment Status</label>
                    <select value={PaymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} name="paymentMode" id="paymentMode" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="" disabled>Select</option>
                      <option value="partial">Partial</option>
                      <option value="full">Full</option>

                    </select>
                  </div>
                  <div>
                    <label for="paytmChannel" class="block mb-2 text-sm font-medium text-gray-900">Paytm Channel</label>
                    <input value={PaymentChannel} onChange={(e) => setPaymentChannel(e.target.value)} type="text" name="paytmChannel" id="paytmChannel" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Paytm Channel" required />
                  </div>
                  <div>
                    <label for="paymentDate" class="block mb-2 text-sm font-medium text-gray-900">Payment Date</label>
                    <input value={PaymentDate} onChange={(e) => setPaymentDate(e.target.value)} type="text" name="paymentDate" id="paymentDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Payment Date" required />
                  </div>
                  <div>
                    <label for="orderAmount" class="block mb-2 text-sm font-medium text-gray-900">Payment Amount</label>
                    <input value={OrderAmount} onChange={(e) => setOrderAmount(e.target.value)} type="text" name="orderAmount" id="orderAmount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Payment Amount" required />
                  </div>
                  {!msg ? ("") : (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                      {msg}
                    </div>)}
                  <button onClick={savePaymentDetails} type="button" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Payment Details</button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>

    </>
  );
};

export default Page;