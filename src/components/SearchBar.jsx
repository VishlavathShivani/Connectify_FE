import {  useState } from "react";
import { useSelector } from "react-redux";
import {
    Autocomplete, TextField ,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {Url } from 'Url';

const SearchBar = () => {
  
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);


  const fetchData = (value) => {
    fetch(`${Url}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          return (
            (value && user) 
            &&
            (
            user.firstName.toLowerCase().includes(value.toLowerCase()) ||
            user.lastName.toLowerCase().includes(value.toLowerCase()) 
            )
          );
        });
        setResults(results);
      });
  };

  const handleOptionSelected = (selectedOption) => {
    // Add functionality for when an option is selected
    console.log(`Option selected: ${selectedOption}`);
    let uid=  results.find((item) => {
      return (
        `${item.firstName} ${item.lastName}` === selectedOption
      );
    });
    if(uid){
      const userId=uid._id
      navigate(`/profile/${userId}`);
      navigate(0);
    }
    else{
      console.log("..");
    }
  };
  // const handleChange = (value) => {
  //  // setInput(value);
  //  setInputValue(value);
  //   fetchData(value);
  // };


  return (
    <div >
        <Autocomplete sx={{ width: 200 }} freeSolo autoSelect disableClearable 
      // value={input}
      // onChange={(e) => handleChange(e.target.value)}

      value={value}
        onChange={(e, newValue) => {
          setValue(newValue);handleOptionSelected(newValue);

        }}

        inputValue={inputValue}
        onInputChange={
          (event, newInputValue) => {
            setInputValue(newInputValue); 
            fetchData(newInputValue);
          }
          //(e) => handleChange(e.target.value)
        }


      options={results.map((option)=> `${option.firstName} ${option.lastName}`)}
      renderInput={(params) => <TextField {...params}  label="Search" variant="standard"
      // InputProps={{
      //   ...params.InputProps,
      //   type: 'search',
      // }}
       />}
    />
    </div>
  );
};

export default SearchBar;