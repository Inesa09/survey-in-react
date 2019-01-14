// import React, { Component } from 'react';



// class SearchField extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//     input2 : document.getElementById("myInput"),
//     countries : [{"area": null, "geo_json": null, "lat": "31.75406111", "lon": "35.17114167", "place_id": 4503857862279168, "place_name": "Amazonka", "wiki_image": "http://commons.wikimedia.org/wiki/Special:FilePath/Jerusalem-haNurit.JPG"}, {"area": null, "geo_json": null, "lat": "31.12115", "lon": "35.40299", "place_id": 4503908059709440, "place_name": "Q56696638", "wiki_image": ""}, {"area": null, "geo_json": null, "lat": "32.10055556", "lon": "34.80172222", "place_id": 4504523347329024, "place_name": "המועצה לישראל יפה", "wiki_image": ""},{"area": null, "geo_json": null, "lat": "33.115", "lon": "35.78888889", "place_id": 4507174315229184, "place_name": "יחידה 8200", "wiki_image": ""}, {"area": null, "geo_json": null, "lat": "32.07479167", "lon": "34.78795", "place_id": 4507668974665728, "place_name": "מַחֲנֶה רַבִּין", "wiki_image": "http://commons.wikimedia.org/wiki/Special:FilePath/Media-tower%20in%20Tel%20Aviv.jpg"}, {"area": null, "geo_json": null, "lat": "32.130444444", "lon": "34.857444444", "place_id": 4507679577866240, "place_name": "בית הספר למוסיקה \"רימון\"", "wiki_image": ""}, {"area": "22.596", "geo_json": {"geometry": {"coordinates": [[[32.4620167, 34.9415819], [32.4599334, 34.9421826], [32.4587217, 34.9441408], [32.4585014, 34.9498849], [32.4588319, 34.9534097], [32.4586116, 34.9635924], [32.4572897, 34.9634618], [32.4515615, 34.9604592], [32.4517818, 34.9630702], [32.4495785, 34.962548], [32.4494615, 34.9622421], [32.4491744, 34.9614449], [32.4487798, 34.9604592], [32.447265, 34.961112], [32.4461634, 34.9630702], [32.4458879, 34.9660075], [32.4462928, 34.9681663], [32.4464388, 34.9689448], [32.4445108, 34.9697608], [32.4455596, 34.9721448], [32.4479536, 34.9723717], [32.4506845, 34.9718959], [32.4509168, 34.9737146], [32.4486609, 34.9741847], [32.44897, 34.977229], [32.453658, 34.986668], [32.4547603, 34.9888774], [32.4558136, 34.9907917], [32.4581434, 34.9890165], [32.4593826, 34.9911379], [32.4628248, 34.9886902], [32.4659915, 34.992117], [32.4648901, 34.9942384], [32.4669553, 34.9966862], [32.4683321, 34.996523], [32.4690205, 34.9986444], [32.4690205, 35.0074564], [32.4694335, 35.0102305], [32.4757663, 35.0151261], [32.4774183, 35.0095778], [32.4800338, 35.0095778], [32.4791089, 35.0036387], [32.4783819, 34.9989708], [32.4800338, 34.9963598], [32.4836129, 34.9948912], [32.4884306, 34.9934225], [32.4887059, 34.9888533], [32.4858153, 34.9882006], [32.4843012, 34.9877111], [32.4848518, 34.985916], [32.4848518, 34.9828155], [32.4833376, 34.9824891], [32.4825117, 34.9803677], [32.4851271, 34.9774304], [32.492147, 34.9806941], [32.4915965, 34.9836314], [32.4946245, 34.9839578], [32.4947621, 34.9864056], [32.4968267, 34.9860792], [32.498203, 34.9803677], [32.5001298, 34.9795518], [32.5001298, 34.9766145], [32.5016437, 34.9766145], [32.5052219, 34.9722085], [32.5041209, 34.9681289], [32.5024695, 34.9678025], [32.4995697, 34.9529395], [32.4937341, 34.9535923], [32.4924127, 34.9529395], [32.4882284, 34.9538534], [32.4864699, 34.9540488], [32.4847046, 34.954245], [32.4829426, 34.9537228], [32.4833705, 34.952634], [32.4836033, 34.9520257], [32.4782681, 34.9489136], [32.4766653, 34.9479787], [32.4752336, 34.9517646], [32.4691761, 34.9477176], [32.4620167, 34.9415819]], [[32.4613288, 34.9464318], [32.4609084, 34.9465663], [32.4603507, 34.948951], [32.4623831, 34.9501647], [32.4621097, 34.9517308], [32.4609834, 34.9521268], [32.4608748, 34.9552811], [32.4634547, 34.9564881], [32.46338, 34.9585527], [32.4640302, 34.9606153], [32.4640078, 34.9618149], [32.4643649, 34.9629924], [32.4650848, 34.9639607], [32.4660998, 34.9642657], [32.466053, 34.9666383], [32.4623241, 34.9652588], [32.4621496, 34.966564], [32.4654792, 34.9680302], [32.4653057, 34.9697385], [32.4609187, 34.9688363], [32.4608235, 34.9719946], [32.4623742, 34.972386], [32.4622119, 34.9745689], [32.4607787, 34.9754514], [32.4608441, 34.979027], [32.465011, 34.983008], [32.4657907, 34.9830065], [32.467502, 34.9826582], [32.4684268, 34.984789], [32.4701381, 34.9838671], [32.4705616, 34.9842666], [32.4697643, 34.985667], [32.4694035, 34.9866023], [32.4682662, 34.9890037], [32.4662574, 34.9918781], [32.4654227, 34.9911453], [32.4643285, 34.9924642], [32.4692068, 34.9991475], [32.469749, 35.0035957], [32.4723636, 35.0033425], [32.4790645, 35.0024369], [32.4785465, 34.9994497], [32.4791085, 34.9991268], [32.4788886, 34.9979638], [32.479435, 34.9975136], [32.4801289, 34.9966042], [32.4806085, 34.9962443], [32.4826404, 34.9945942], [32.4842263, 34.9943713], [32.4860809, 34.9941107], [32.4875987, 34.99317], [32.4877255, 34.9920865], [32.4859417, 34.9917621], [32.4860983, 34.9894618], [32.4859109, 34.9878461], [32.4813945, 34.9871436], [32.4816899, 34.982098], [32.4804426, 34.9819814], [32.4782539, 34.9774094], [32.4861388, 34.9724251], [32.4860562, 34.9701262], [32.4848676, 34.9662322], [32.4839811, 34.964278], [32.4837957, 34.9620783], [32.4814517, 34.9638461], [32.4814069, 34.9627223], [32.4796934, 34.9629047], [32.4788453, 34.9555612], [32.4787524, 34.9545291], [32.478795, 34.9536436], [32.4774355, 34.9530056], [32.4760059, 34.9520806], [32.4749191, 34.9514433], [32.4680135, 34.9480178], [32.4642581, 34.9469617], [32.4625632, 34.9470487], [32.4616424, 34.9466137], [32.4613288, 34.9464318]]], "type": "Polygon"}}, "lat": "32.471111111", "lon": "34.9675", "place_id": 4508440357502976, "place_name": "America", "wiki_image": "http://commons.wikimedia.org/wiki/Special:FilePath/Pardes%20Hanna-Karkur%20municipality%20building%20sept%202006.jpg"}],
//     }
//   }
  
//    autocomplete(inp, arr) {
//     /*the autocomplete function takes two arguments,
//     the text field element and an array of possible autocompleted values:*/
//     var currentFocus;
//     /*execute a function when someone writes in the text field:*/
//     inp.addEventListener("input", function(e) {
//         var val = this.value;
//         /*close any already open lists of autocompleted values*/
//         closeAllLists();
//         if (!val) { return false;}
//         currentFocus = -1;
//         /*create a DIV element that will contain the items (values):*/
//         var a = document.createElement("DIV");
//         a.setAttribute("id", this.id + "autocomplete-list");
//         a.setAttribute("class", "autocomplete-items");
//         /*append the DIV element as a child of the autocomplete container:*/
//         this.parentNode.appendChild(a);
//         /*for each item in the array...*/
//         for (let i = 0; i < arr.length; i++) {
//           console.log(arr[i].place_name);
//           /*check if the item starts with the same letters as the text field value:*/
//           if (arr[i].place_name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//             /*create a DIV element for each matching element:*/
//             var b = document.createElement("DIV");
//             /*make the matching letters bold:*/
//             b.innerHTML = "<strong>" + arr[i].place_name.substr(0, val.length) + "</strong>";
//             b.innerHTML += arr[i].place_name.substr(val.length);
//             /*insert a input field that will hold the current array item's value:*/
//             b.innerHTML += "<input type='hidden' value='" + arr[i].place_name + "'>";
//             /*execute a function when someone clicks on the item value (DIV element):*/
//            // console.log(marker);
//             b.addEventListener("click", function(e) {
//                 /*insert the value for the autocomplete text field:*/
//                 inp.value = this.getElementsByTagName("input")[0].value;
//                 console.log(this.marker);
//                 for(let j = 0; j < arr.length; j++){
//                   console.log(arr);
//                   console.log(i);
//                   if(inp.value === arr[j].place_name){
//                      //markerController(parseFloat(arr[j].lat),parseFloat(arr[j].lon)); 
//                     break;
//                   }
//                 }
  
//                 console.log(inp.value);
//                 /*close the list of autocompleted values,
//                 (or any other open lists of autocompleted values:*/
//                 closeAllLists();
//             });
//             a.appendChild(b);
//           }
//         }
//     });
//     /*execute a function presses a key on the keyboard:*/
//     inp.addEventListener("keydown", function(e) {
//         var x = document.getElementById(this.id + "autocomplete-list");
//         if (x) x = x.getElementsByTagName("div");
//         if (e.keyCode == 40) {
//           /*If the arrow DOWN key is pressed,
//           increase the currentFocus variable:*/
//           currentFocus++;
//           /*and and make the current item more visible:*/
//           addActive(x);
//         } else if (e.keyCode == 38) { //up
//           /*If the arrow UP key is pressed,
//           decrease the currentFocus variable:*/
//           currentFocus--;
//           /*and and make the current item more visible:*/
//           addActive(x);
//         } else if (e.keyCode == 13) {
//           /*If the ENTER key is pressed, prevent the form from being submitted,*/
//           e.preventDefault();
//           if (currentFocus > -1) {
//             /*and simulate a click on the "active" item:*/
//             if (x) x[currentFocus].click();
//           }
//         }
//     });
//     function addActive(x) {
//       /*a function to classify an item as "active":*/
//       if (!x) return false;
//       /*start by removing the "active" class on all items:*/
//       removeActive(x);
//       if (currentFocus >= x.length) currentFocus = 0;
//       if (currentFocus < 0) currentFocus = (x.length - 1);
//       /*add class "autocomplete-active":*/
//       x[currentFocus].classList.add("autocomplete-active");
//     }
//     function removeActive(x) {
//       /*a function to remove the "active" class from all autocomplete items:*/
//       for (var i = 0; i < x.length; i++) {
//         x[i].classList.remove("autocomplete-active");
//       }
//     }
//     function closeAllLists(elmnt) {
//       /*close all autocomplete lists in the document,
//       except the one passed as an argument:*/
//       var x = document.getElementsByClassName("autocomplete-items");
//       for (var i = 0; i < x.length; i++) {
//         if (elmnt != x[i] && elmnt != inp) {
//           x[i].parentNode.removeChild(x[i]);
//         }
//       }
//     }
//     /*execute a function when someone clicks in the document:*/
//     document.addEventListener("click", function (e) {
//         closeAllLists(e.target);
//     });
//   }
  
//   componentDidMount() {
//       console.log(this.state.input2);
//     this.autocomplete(this.state.input2, this.state.countries);
//   }
  
//   render() {
//       return(
//     <div className="autocomplete" style={{width: '300px',}}>
//     <input
//      id="myInput" type="text" name="myCountry" placeholder="Country"/>
//   </div>
//       )
//   }
// }




// export default SearchField;
/*global google*/ 
import React, { Component } from 'react';
import Autocomplete from  'react-autocomplete';
import '../css/SearchField.css';

class SearchField extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            value: '',
            places: []
        };
    
    }
    componentDidMount(){
      console.log(1010100101010101010011111111111111111111111111);
      fetch('https://roadio-master.appspot.com/v1/get_places?limit=-1')
     .then(response =>response.json())
     .then(data => this.setState({ places: data}));
    }
  matchStocks(state, value){
    return (state.place_name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  render() {
    return (
      <div style = {{ marginTop: 40, marginLeft: 50 }}>
        <Autocomplete
          value={ this.state.value }
          inputProps={{ id: 'states-autocomplete' }}
          wrapperStyle={{ position: 'relative', display: 'inline-block' }}
          items={ this.state.places }
          getItemValue={ item => item.place_name }
          shouldItemRender={ this.matchStocks }
          onChange={(event, value) => this.setState({ value }) }
          onSelect={ value => {
              for( let i = 0, size = this.state.places.length; i < size; i++){
                console.log(i);
                console.log(value);
                console.log(this.state.places[i].place_name.toLowerCase(), value.toLowerCase());
                  if(this.state.places[i].place_name.toLowerCase() === value.toLowerCase()){
                    console.log(this);
                    let lat = parseFloat(this.state.places[i].lat);
                    let lng = parseFloat(this.state.places[i].lon);
                    let newmarker = {};
                    newmarker.position = new google.maps.LatLng(lat, lng);
                    let markers = [newmarker];
                    console.log(this.props.center);
                    console.log(markers[0].position);
                    // console.log(this.props.marker);            
                    // console.log(new google.maps.LatLng(lat, lng));
                     this.props.onPlacesChangedAutoCompleate(markers, lat, lng);
                    console.log(this.props.marker);
                    break;
                  }
              }
              console.log(this.state.places);
              console.log(value);
              this.setState({ value }) ;
            
            
            }}
          renderMenu={ children => (
            <div className = "menu">
              { children }
            </div>
          )}
          renderItem={ (item, isHighlighted) => (
            <div
              className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
              key={ item.place_name } >
             {item.place_name}
            </div>
          )}
        />
      </div>
      );
    }
  }

  export default SearchField;