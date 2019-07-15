// const supportedCards = {
//     visa :"images/visa.png",
//     mastercard:"images/mastercard.png"
//   };
  
  const countries = [
    {
      code: "US",
      currency: "USD",
      country: 'United States'
    },
    {
      code: "NG",
      currency: "NGN",
      country: 'Nigeria'
    },
    {
      code: 'KE',
      currency: 'KES',
      country: 'Kenya'
    },
    {
      code: 'UG',
      currency: 'UGX',
      country: 'Uganda'
    },
    {
      code: 'RW',
      currency: 'RWF',
      country: 'Rwanda'
    },
    {
      code: 'TZ',
      currency: 'TZS',
      country: 'Tanzania'
    },
    {
      code: 'ZA',
      currency: 'ZAR',
      country: 'South Africa'
    },
    {
      code: 'CM',
      currency: 'XAF',
      country: 'Cameroon'
    },
    {
      code: 'GH',
      currency: 'GHS',
      country: 'Ghana'
    }
  ];
  

    const appState = {};
      
    
  const formatAsMoney = (amount, buyerCountry) =>{ 
    const bill = countries.find(country =>{
     return country.country === buyerCountry
    })|| country.find(country=>{
      return country.country ==='United States', country.code ==='US'
    });
    console.log(amount);
    console.log(buyerCountry)
  return amount.toLocaleString('en-'+ bill.code,{
    style:`currency`,
    currency:bill.currency
    
  });

    
  }
                              
                         
  
  const flagIfInvalid = (field, isValid) =>{
    if(isValid){
      field.classList.remove("is-invalid");
    }
    else{
      field.classList.add("is-invalid");
      
    }
      
  }
  const expiryDateFormatIsValid = (target)=>{
    return /^[\d]{2}\/[\d]{2}$/.test(target.value);
    
  }
  const detectCardType = ({target}) =>{
   const input = target.value;
   const creditCard= document.querySelector("div[data-credit-card]") ;
   const cardImg = document.querySelector("img[data-card-type]");
    
   if(input.startsWith('4')){
     creditCard.classList.remove("is-mastercard")
     creditCard.classList.add("is-visa");
     cardImg.src= supportedCards.visa;
     return "is-visa"
   } 
    else if(input.startsWith('5')){
      creditCard.classList.remove("is-visa");
      creditCard.classList.add("is-mastercard");
      cardImg.src = supportedCards.mastercard;
      return "is-mastercard";
    }
    // if it is neither visa or master card
    else{
      creditCard.classList.remove('is-visa');
      creditCard.classList.remove('is-master');
      return 'Not Mastercard or visacard';
    }
  };
    
  const validateCardExpiryDate = ({target})=>{
    const today = new Date();
    const todayYear = `${today.getFullYear()}`.slice(-2);
    const expired  = todayYear < target.value.slice(-2);
    const isValid = expiryDateFormatIsValid(target) && expired;
    flagIfInvalid(target, isValid);
    return isValid;
  }   
  const validateCardHolderName = ({target}) =>{
    const isValid = /^([A-Z][a-z]{2,50})+(\s)[A-z][a-z]{2,50}$/.test(target.value);
    flagIfInvalid(target, isValid);
    return isValid;
  }
  
  const validateWithLuhn = (digits) =>{
  let isValid = true;
    if(digits.length<16 || digits.length>16  || !isNaN(digits) ){
      isValid = false;
    }
    else{
      for(let x =digits.length-2; x>=0; x=x-2 ){
        digits[x]= digits[x]*2;
        if(digits[x]>9){
          digits[x] = digits[x]-9;
        }
      }
      const total = digits.reduce((accumulator, currentValue) =>{
        return accumulator + currentValue;
      },0);
      const result = total%10;
      if(result ==0){
        isValid= true;
      }
      else{
        isValid = false;
      }
    }
    return isValid;
  }
  
  const validateCardNumber = ()=>{
    const target = [];
    let value = '';
    const elem = document.querySelector('div[data-cc-digits]');
    for(let i= 1; i<5; i++){
      value = document.querySelector('div[data-cc-digits] input:nth-child('+i+')');
      target.push(value.value);
    }
    let cardDigi =[];
    let num = 0;
    let temp = '';
    for (let i=0; i<target.length; i++){
      temp = target[i];
      for(let j=0; j<temp.length; j++){
        num = parseInt(temp[j], 10);
        cardDigi.push(num);
      }
    }
      const isValid =   validateWithLuhn(cardDigi);
    flagIfInvalid(elem,isValid);
    return isValid;
  }
  
  const uiCanInteract =() =>{
    const dataDigits = document.querySelector("div[data-cc-digits]>input");
      dataDigits.addEventListener("blur", detectCardType);
    const dataName = document.querySelector("div[data-cc-info]>input");
    dataName.addEventListener("blur", validateCardHolderName);
    const dataExpiry = document.querySelector("div[data-cc-info] input:nth-child(2)" );
    dataExpiry.addEventListener("blur", validateCardExpiryDate);
    const payBtn = document.querySelector("button[data-pay-btn]");
    payBtn.addEventListener("click", validateCardNumber);  
    dataDigits.focus();
  }
  
  const displayCartTotal = ({results}) =>{
    const [data] = results;
    const {itemsInCart, buyerCountry} = data;
    appState.items = itemsInCart;
    appState.country = buyerCountry;
    appState.bill = itemsInCart.reduce((prev,cur)=>{
        return  prev +(cur.qty*cur.price);
    },0);
    
    appState.billFormatted = formatAsMoney(appState.bill, appState.country);   
    document.querySelector('[data-bill]').textContent = appState.billFormatted;
    uiCanInteract();
  };
  
   const fetchBill = () =>{
     const api = 'https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c';
     fetch(api)
         .then(response => response.json())
         .then(data => { 
            console.log('here');

               data = JSON.stringify(data);
             data = JSON.parse(data);
               return displayCartTotal(data);
     })
     .catch(error=>"error");
   }      
   
   const startApp = () =>{
     fetchBill();
  };

  startApp();

