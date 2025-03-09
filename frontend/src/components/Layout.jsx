import React, { useState, useEffect  } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
const Layout = () => {
  // Hooks to manage states of the variables
  // State for ledger selection, date, and draw time
  const [ledger, setLedger] = useState("LEDGER");
  const [drawTime, setDrawTime] = useState("11 AM");
  const [drawDate, setDrawDate] = useState(new Date().toISOString().split('T')[0]);
  const [closingTime, setClosingTime] = useState("");
  const [entries, setEntries] = useState([]);  // table entries
  const [no, setNo] = useState('');
  const [f, setF] = useState('');
  const [s, setS] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

   // State for storing permutations
   const [permutations, setPermutations] = useState([]);  // we will set permutation in the table entreis

   // Function to generate permutations
  const getPermutations = (str) => {
    let results = [];
    if (str.length === 1) return [str];
    
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const remainingChars = str.slice(0, i) + str.slice(i + 1);
      const remainingPermutations = getPermutations(remainingChars);
      
      for (const perm of remainingPermutations) {
        results.push(char + perm);
      }
    }
    return results;
  };

  // Function to get combinations of a certain length (for 4 figures Ring 24)
  const getCombinations = (str, length) => {
    if (length === 1) return str.split("");
    if (length === str.length) return [str];

    let combinations = [];
    for (let i = 0; i < str.length; i++) {
      let remaining = str.slice(0, i) + str.slice(i + 1);
      let subCombinations = getCombinations(remaining, length - 1);
      subCombinations.forEach(sub => combinations.push(str[i] + sub));
    }
    return combinations;
  };

    // Function to get all permutations of a string
    const getPermutation = (str) => {
      if (str.length === 1) return [str];
  
      return str.split("").flatMap((char, i) =>
        getPermutation(str.slice(0, i) + str.slice(i + 1)).map(perm => char + perm)
      );
    };

     // Function to generate ordered 3-digit permutations (actual function to get permutation)
  const generateOrderedPermutations = (num, length =3) => {
    let str = num.toString();
    if (str.length !==4) {
      console.log("plz enter a 4 digit number");
          return [];
    }
    let combinations = getCombinations(str, length);
    let allPermutations = combinations.flatMap(getPermutation);

    return Array.from(new Set(allPermutations)).sort((a, b) => a[0].localeCompare(b[0]));
  };


     // genarte the 5 figure ring (60)
  const generate5DigitPermutations = (num, length = 3) => {
    let str = num.toString();
    if (str.length !== 5) {
      console.log("Please enter a 5-digit number.");
      return [];
    }
  
    let combinations = getCombinations(str, length);
    let allPermutations = combinations.flatMap(getPermutation);
  
    return Array.from(new Set(allPermutations)).sort((a, b) => a[0].localeCompare(b[0]));
  };

   // genarte the 5 digit ring (120)
   const generate6DigitPermutations = (num, length = 3) => {
    let str = num.toString();
    if (str.length !== 6) {
      console.log("Please enter a 6-digit number.");
      return [];
    }
  
    let combinations = getCombinations(str, length);
    let allPermutations = combinations.flatMap(getPermutation);
  
    return Array.from(new Set(allPermutations)).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const  handle6FigureRing = ()=>{
    if (no.length <6) {
         console.log("plz enter the ast leat 6 digits");
         return;
    }

     const result = generate6DigitPermutations(no, 3);
     console.log(result);
     

     const updatedEntries = result.map((perm, index) => ({
      id: index + 1,
      no: perm,
      f: f,  
      s: s,  
      selected: false,
    }));

    setEntries(updatedEntries);
  }

  const  handle5FiguresRing = ()=>{
    if (no.length <5) {
        console.log("plz enete the at least 5 digit");    
        return;
    } 
           
        const result = generate5DigitPermutations(no, 3);
        console.log(result);
         
        const updatedEntries = result.map((perm, index) => ({
          id: index + 1,
          no: perm,
          f: f,  
          s: s,  
          selected: false,
        }));
    
        setEntries(updatedEntries);

  }

   // Handle button click
   const handle4FiguresRing = () => {
    if (no.length <4) {
      console.log("Please enter at least a 4-digit number.");
      return;
    }
    const result = generateOrderedPermutations(no, 3);
    console.log("Generated Permutations:", result); // Logs result in console

    //setPermutations(result); // Store the result in state

    // Update entries state with new permutations
    const updatedEntries = result.map((perm, index) => ({
      id: index + 1,
      no: perm,
      f: f,  
      s: s,  
      selected: false,
    }));
    
    
    setEntries(updatedEntries);
  };



// Handle Chakri Ring button click
const handleChakriRing = () => {
  if (no && f && s) {
    const generatedPermutations = getPermutations(no);
    // Update entries with permutations
    const updatedEntries = generatedPermutations.map((perm, index) => ({
      id: index + 1,
      no: perm,
      f: f,  // Add relevant data
      s: s,  // Add relevant data
      selected: false
    }));

    setEntries(updatedEntries);
    // setNo(''),
    // setF(''),
    // setS('')
  }
};

// Handle Chakri Back Ring button click
const handleChakriRingBack = () =>{
   if (no &&  f && s) {
       const generatedPermutations= getPermutations(no);
       const updatedEntriesback =  generatedPermutations.map((perm , index)=>({
        id: index+1,
        no: `x${perm}`, // Ensure both are strings
        f: f,
        s:s,
        selected:false
       }));
       setEntries(updatedEntriesback) ;
      //  setNo(''),
      //  setF(''),
      //  setS('')
      //  console.log(updatedEntriesback);
       // set the fields empty
      }     
};

// Handle Chakri Ring button click
const handleChakriRingCross = () => {
  if (no && f && s) {
    const generatedPermutations = getPermutations(no);
    const updatedEntriescross = generatedPermutations.map((perm, index) => {
      const modifiedPerm = perm.slice(0, 1) + "x" + perm.slice(1); // Insert "x" at the second position

      return {
        id: index + 1,
        no: modifiedPerm, 
        f: f,
        s: s,
        selected: false
      };
    });

    setEntries(updatedEntriescross);
    // setNo('');
    // setF('');
    // setS('');
    // console.log(updatedEntriescross);
  }
};

// Handle Chakri Ring with double cross button click
const handleChakriRingDouble = () => {
  if (no && f && s) {
    const generatedPermutations = getPermutations(no);
    const updatedEntriesdouble = generatedPermutations.map((perm, index) => {
      const modifiedPerm = perm.slice(0, 2) + "x" + perm.slice(2); // Insert "x" at the second position

      return {
        id: index + 1,
        no: modifiedPerm, 
        f: f,
        s: s,
        selected: false
      };
    });

    setEntries(updatedEntriesdouble);
    // setNo('');
    // setF('');
    // setS('');
    // console.log(updatedEntriesdouble);
  }
};


  
      // handleprint
// Function to generate downloadable PDF
const handleDownloadPDF = () => {
  if (ledger !== "VOUCHER" || entries.length === 0) {
    alert("There is nothing to download or Ledger is not set to Voucher.");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4"); // Portrait mode, millimeters, A4 size
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Title and Dealer Details (Only on first page)
  const addHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Voucher Sheet", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Dealer Name: Sohail`, 14, 30);
    doc.text(`City: Karachi`, 14, 40);
    doc.text(`Draw Date: ${drawDate}`, 14, 50);
    doc.text(`Draw Time: ${drawTime}`, 14, 60);
  };

  addHeader(); // Add header to the first page

  let startY = 70; // Start table below details

  doc.autoTable({
    startY: startY,
    head: [["Num", "F", "S"]],
    body: entries.map(entry => [entry.no, entry.f, entry.s]),
    theme: "grid",
    headStyles: { fillColor: [0, 0, 255] },
    styles: { align: "center", fontSize: 12 },
    margin: { left: 14 },
    didDrawPage: function (data) {
      if (data.pageNumber > 1) {
        addHeader(); // Add header on new pages
        doc.setFontSize(14);
        doc.text("Continued...", pageWidth / 2, 65, { align: "center" });
      }
    },
  });

  // Save PDF
  doc.save("Voucher_Sheet_RLC.pdf");
};





  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isPastClosingTime = (time) => {
    const [hour, period] = time.split(" ");
    let drawHour = parseInt(hour, 10);
    if (period === "PM" && drawHour !== 12) drawHour += 12;
    if (period === "AM" && drawHour === 12) drawHour = 0;

    let closingHour = drawHour - 1;
    if (closingHour === -1) closingHour = 23;

    const closingTimeObj = new Date();
    closingTimeObj.setHours(closingHour, 51, 0);

    return currentTime >= closingTimeObj;
  };


  // useEffect 
  useEffect(() => {
    // Calculate closing time (9 minutes before the next hour)
    const [hour, period] = drawTime.split(" ");
    let closingHour = parseInt(hour);
    let closingPeriod = period;
    if (closingHour === 12) {
      closingPeriod = period === "AM" ? "PM" : "AM";
    } else {
      closingHour = closingHour + 1;
    }
    setClosingTime(`${closingHour === 12 ? 12 : closingHour}:${"51"} ${closingPeriod}`);
  }, [drawTime]);


  const addEntry = () => {
    if (no && f && s) {
      setEntries([...entries, { id: entries.length + 1, no, f, s, selected: false }]);
      setNo('');
      setF('');
      setS('');
    }
  };

  const deleteSelected = () => {
    setEntries(entries.filter(entry => !entry.selected));
  };

  const deleteAll = () => {
    setEntries([]);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setEntries(entries.map(entry => ({ ...entry, selected: !selectAll })));
  };




  return (
    <div className="flex h-screen min-h-[820px] bg-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col p-5">
        <div className="text-2xl font-bold mb-6">Dealer</div>
        <nav className="flex flex-col space-y-4">
          <a href="/" className="px-3 py-2 rounded-md hover:bg-blue-700">Book</a>
          <a href="#" className="px-3 py-2 rounded-md hover:bg-blue-700">Hisab</a>
          <a href="#" className="px-3 py-2 rounded-md hover:bg-blue-700">Voucher Inbox</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 ">
        {/* Header */}
        <header className="bg-purple-700 text-white p-4 rounded-md grid grid-cols-3 gap-4 items-center">
          <div className="flex flex-col space-y-2">
            <div className="text-lg font-semibold">Name: <input type="text" value="SOHAIL" className="bg-white text-black px-2 py-1 rounded" readOnly /></div>
            <div className="text-lg font-semibold">City: <input type="text" value="KHI" className="bg-white text-black px-2 py-1 rounded" readOnly /></div>
            <div className="text-lg font-semibold">Dealer ID: <input type="text" value="****" className="bg-white text-black px-2 py-1 rounded" readOnly /></div>
            <div className="text-lg font-semibold">Balance: <input type="text" value="34128.1" className="bg-white text-black px-2 py-1 rounded" readOnly /></div>
          </div>

          <div className="flex flex-col space-y-2">
            {/* Ledger dropdown */}
            <div className="text-lg font-semibold">Ledger:
              <select className="bg-white text-black px-2 py-1 rounded" value={ledger} onChange={(e)=> setLedger(e.target.value)}>
                <option>LEDGER</option>
                <option>DAILY BILL</option>
                <option>VOUCHER</option>
              </select>
            </div>

            <div className="text-lg font-semibold">Draw Name:
              <select
                className="bg-white text-black px-2 py-1 rounded"
                value={drawTime}
                onChange={(e) => setDrawTime(e.target.value)}
              >
                {[...Array(13)].map((_, i) => {  // Increase range to 13 to include 11 PM
                  const hour = 11 + i;
                  const period = hour >= 12 ? "PM" : "AM";
                  const formattedHour = hour > 12 ? hour - 12 : hour;
                  const time = `${formattedHour === 0 ? 12 : formattedHour} ${period}`;
                  return <option key={time} value={time}>{time}</option>;
                })}
              </select>
            </div>

            <div className="text-lg font-semibold">Draw Date:
              <input type="date" className="bg-white text-black px-2 py-1 rounded" value={drawDate} onChange={(e) => setDrawDate(e.target.value)} />
            </div>
                {/* Print Button */}
                <button className="px-4 py-2 bg-green-600 text-white rounded-md" onClick={handleDownloadPDF}>Print</button>
          </div>

          {/* Draw Time Section */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-black">Draw Time Selection</h2>

            {/* Time Dropdown */}
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-black">Select Draw Time:</label>
              <select
                className="bg-white text-black px-2 py-1 rounded"
                value={drawTime}
                onChange={(e) => setDrawTime(e.target.value)}
              >
                {[...Array(13)].map((_, i) => {  // Increase range to 13 to include 11 PM
                  const hour = 11 + i;
                  const period = hour >= 12 ? "PM" : "AM";
                  const formattedHour = hour > 12 ? hour - 12 : hour;
                  const time = `${formattedHour === 0 ? 12 : formattedHour} ${period}`;
                  return <option
                  key={time}
                  value={time}
                  disabled={isPastClosingTime(time)}
                  style={{ backgroundColor: isPastClosingTime(time) ? "red" : "white", color: isPastClosingTime(time) ? "white" : "black" }}
                >
                  {time} {isPastClosingTime(time) ? "(Closed)" : ""}
                </option>;
                })}
              </select>

            </div>

            <p className='text-black'><strong>Today Date:</strong> {new Date().toLocaleDateString()} ({new Date().toLocaleString('en-us', { weekday: 'long' })})</p>

            {/* Closing Time Calculation */}
            <p className='text-black'><strong>Closing Time:</strong> {
              (() => {
                const [hour, period] = drawTime.split(" ");
                let closingHour = parseInt(hour, 10);
                if (period === "PM" && closingHour !== 12) closingHour += 12;
                const closingTime = new Date();
                closingTime.setHours(closingHour - 1, 51, 0); // 9 minutes before the next draw
                return closingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
              })()
            }</p>
          </div>


        </header>
        {/* // header end */}

        {/* Body Content */}
        <div className="grid grid-cols-2 gap-6 mt-6">

          {/* Table Content */}
          <div className='bg-white min-h-[500px] p-6 rounded-lg shadow-md flex flex-col'>
            <div className='flex space-x-4 mb-4'>
              <button onClick={toggleSelectAll} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500'>
                {selectAll ? 'Deselect All' : 'Select All'}
              </button>
              <button onClick={deleteSelected} className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500'>Delete Selected</button>
              <button onClick={deleteAll} className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500'>Delete All</button>
              {/* <span>count table entreis </span> */}
            </div>
       {/* // displaying in the tabke  */}
            <div className='max-h-60 border rounded-md overflow-y-auto'>
              
              <table className='w-full border-collapse'>
                <thead>
                  <tr className='bg-gray-200'>
                    <th className='border p-2'>Select</th>
                    <th className='border p-2'>Num</th>
                    <th className='border p-2'>F</th>
                    <th className='border p-2'>S</th>
                    <th className='border p-2'>Actions</th>
                    
                  </tr>
                  <div className='flex justify-center'>
                  <span className='text-2xl'>{`(${entries.length})`}</span>
                  </div>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.id} className='border-b'>
                      <td className='border p-2 text-center'>
                        <input
                          type='checkbox'
                          checked={entry.selected}
                          onChange={() =>
                            setEntries(entries.map(e => e.id === entry.id ? { ...e, selected: !e.selected } : e))
                          }
                        />
                      </td>
                      <td className='border p-2 text-center'>{entry.no}</td>
                      <td className='border p-2 text-center'>{entry.f}</td>
                      <td className='border p-2 text-center'>{entry.s}</td>
                      <td className='border p-2 text-center'>
                        <button className='bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400'>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Input Fields - Fixed at the Bottom */}
            <div className='mt-auto flex space-x-2 pt-4'>
              <input
                type='text'
                value={no}
                onChange={(e) => setNo(e.target.value)}
                placeholder='NO'
                className='border p-2 rounded w-1/3'
              />
              <input
                type='text'
                value={f}
                onChange={(e) => setF(e.target.value)}
                placeholder='F'
                className='border p-2 rounded w-1/3'
              />
              <input
                type='text'
                value={s}
                onChange={(e) => setS(e.target.value)}
                placeholder='S'
                className='border p-2 rounded w-1/3'
              />
              <button onClick={addEntry} className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500'>Save</button>
            </div>
          </div>
         


          
        {/* Printable Voucher */}
        
 


          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex space-x-4 mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Upload Sheet</button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500">View Sheet</button>
            </div>
            {/* // keeps buttons here */}
            <div className="flex gap-4 pt-4">
             
              <div className="w-1/2">
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2" onClick={handleChakriRing}>Chakri Ring</button>
               
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2" onClick={handleChakriRingBack}>Back Ring</button>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2" onClick={handleChakriRingCross}>Cross Ring</button>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2" onClick={handleChakriRingDouble}>Double Cross</button>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2">Palty Akra</button>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2">Figure Akra</button>
              </div>
 
              {/* Right Column */}
              <div className="w-1/2">
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2" onClick={handle4FiguresRing}>4 Figure Ring</button>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2" onClick={handle5FiguresRing}>5 Figure Ring</button>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2" onClick={handle6FigureRing}>6 Figure Ring</button>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2">Ring + Akra</button>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 m-2">11 Figure</button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Layout;
