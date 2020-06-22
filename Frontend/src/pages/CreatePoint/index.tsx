// useEffect >> this function will help us to fetch our Axios services to our components!
// ChangeEvent >> will collect the data inside the event from a form!
// FormEvent >> handle the submit from Forms avoiding autorefresh (the default action from onSubmit is redirect the user for another page, so in order to keep the SPA we need to do this)
// useHistory >> Allows us to navigate between pages without a button (after a submit you redirect)
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'; 
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/Dropzone/index'
import axios from 'axios';
import api from '../../services/api';
import logo from '../../assets/logo.svg';
import './styles.css';

// Typescript Warning: For array or JSObject you MUST inform the variable type


// Typescript interfaces
interface Item {
    id: number,
    title: string,
    img_url: string
}


interface IBGEUFResponse {

    sigla: string

}

interface IBGECityResponse {

    nome: string

}



const CreatePoint = () => {

    // Array of items for image loading!
    const [items, setItems] = useState<Item[]>([]); //Add typing in the useState!

    // Array of States to be preloaded
    const [ufs, setUFs] = useState<string[]>([]);

    // Array of Cities given the selected state/district/UF 
    const [cities, setCities] = useState<string[]>([]);

    // This state will save which state/district/UF was selected by the user
    const [selectedUF, setSelectedUF] = useState('0');

    // This state will save which city was selected
    const [selectedCity, setSelectedCity] = useState('0');

    // Get selected GPS Coordinates position
    const [selectedPosition, setSelectedPosition] = useState<number, number>([0,0]);

    // Initial GPS Coordinates position from browser
    const [initialPosition, setInitialPosition] = useState<number, number>([0,0]);

    // Dropzone storage!
    const [selectedFile, setSelectedFile] = useState<File>();

    // Saving data from initial forms
    const [formData, setFormData] = useState({

        name: '',
        email: '',
        whatsapp: '',

    });

    // Saving data from selected items to be recycled
    const [selectedItems, setSelectedItems] = useState<number[]>([]); 

    // Redirect with browser history
    const history = useHistory();




    // External Front-end Links

    // Get the current GPS position from user
    useEffect(() => {

        // This native global variable will allows us to get GPS coord from user.
         navigator.geolocation.getCurrentPosition(position => {

            console.log(position);
            const {latitude, longitude} = position.coords; //destructuring!

            setInitialPosition([latitude, longitude]);

        });


    }, []);

    // Backend Link
    useEffect(() => { // Parameters >>> Function to be executed 1x / Condition

        // Base URL from our backend
        api.get('items').then(response => { // you need to use '.then()'. Async / await is not allowed!!!

            console.log(response);
            setItems(response.data); // This "data" is the array from backend!

        }) 

    }, []); 


    // IBGE API Link - States
    useEffect(()=> {
            axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            console.log(response);

            const ufInitials = response.data.map(uf => uf.sigla);
            setUFs(ufInitials);
        })    
    }, []);


    // IBGE API Link - Cities
    useEffect(() => {
        
        // Everytime the user select the state, change the city

        if(selectedUF === '0'){
            return;

        } else {
            
            // Remember: Use ` to insert JS code into a string
            axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {

                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames);

            })
        }

    }, [selectedUF]); // if our variable has its state changed...RUN!!! =D



    // onChange / onPress / onClick >> State Handlers
    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){ //event is a change event from a Select HTML element

        const uf = event.target.value;

        setSelectedUF(uf);

    }

    // Get the information from selected city
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){ //event is a change event from a Select HTML element

        const city = event.target.value;

        setSelectedCity(city);

    }

    // Get the information from selected Pinpoint on the map
    function handleMapClick(event: LeafletMouseEvent){

        console.log(event.latlng);
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);

    }

    // Get the information from the primary inputs
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){

        const {name, value} = event.target;

        setFormData({...formData, [name]: value}); //...formData will keep the old values and just add new ones!
                                                   // using [name] will allows us to use the variable name as a type instead of name: value, address: value, whatsapp: value
    }

    // Get the items to be recycled whose are selected. You can also remove your choose!!! =) 
    function handleSelectItem(id: number){

        const alreadySelected = selectedItems.findIndex(item => item === id); // returns the index of the item found otherwise -1

        if(alreadySelected >= 0){

            const filteredItems = selectedItems.filter(item => item != id);

            setSelectedItems(filteredItems);

        } else {
        setSelectedItems([...selectedItems, id]);
        }
    }

    // Submit everything to the backend!
    async function handleSubmit(event :FormEvent){
        
        event.preventDefault(); // Prevent the default pattern from submit that is redirecting the user for another page. This keep our SPA assumptions

        const { name, email, whatsapp } = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData(); // Global class from Javascript. This will adapt our code to Multipart instead JSON
        data.append('name',name);
        data.append('email',email);
        data.append('whatsapp',whatsapp);
        data.append('uf',uf);
        data.append('city',city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if(selectedFile) {

            data.append('image', selectedFile);

        }

/*        const data = {
            name,
            email, 
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };
*/
        await api.post('points', data); // Calls our API function to integrate with Backend

        alert('Ponto de coleta criado com sucesso!');
        
        history.push('/'); // Redirect for home
    }

    // HTML Return
    return(    
            <div id="page-create-point">
                <header>
                    <img src={logo} alt="Ecoleta" />
                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para Home Page
                    </Link>
                </header>
                <form onSubmit={handleSubmit}>
                    <h1>Cadastro do <br />ponto de coleta</h1>

                    {/* We will create this property! for this go to the index.tsx and create an props interface! */}
                    <Dropzone onFileUploaded={setSelectedFile} />

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>

                        <div className="field">

                            <label htmlFor="name">Nome da Entidade</label>
                            <input type="text" name="name" id="name" onChange={handleInputChange} />

                        </div>

                        <div className="field-group">

                            <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="text" name="email" id="email" onChange={handleInputChange} />
                            </div>

                            <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
                            </div>

                        </div>
                    </fieldset>



                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione o endereço no mapa</span>
                        </legend>


                        <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}/>
                        </Map>



                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado (UF)</label>
                                <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUF}>
                                    <option value="0">Selecione uma UF</option>
                                    {ufs.map(uf => (
                                     <option key={uf} value={uf}>{uf}</option>                                    
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                    <option value="0">Selecione uma cidade</option>
                                    {cities.map(city => (
                                     <option key={city} value={city}>{city}</option>                                    
                                    ))}
                           
                                </select>
                            </div>

                        </div>
                    </fieldset>



                    <fieldset>
                        <legend>
                            <h2>Ítens de Coleta</h2>
                            <span>Selecione um ou mais itens abaixo</span>
                        </legend>
                        <ul className="items-grid">
                            {items.map(item => (                  //selectedItems.includes(item.id) >> Returns TRUE OR FALSE during the inclusion
                                 <li key={item.id} className={selectedItems.includes(item.id) ? 'selected' : ''} onClick={() => handleSelectItem(item.id)}> 
                                     <img src={item.img_url} alt={item.title} />
                                     <span>{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </fieldset>
                    <button type="submit">Cadastrar ponto de coleta</button>
                </form>
            </div>        
        );


}

export default CreatePoint;