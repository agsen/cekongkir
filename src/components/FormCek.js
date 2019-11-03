import React, { Component } from 'react';
import '../styles/FormCek.css';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import {cities} from '../assets/Cities';
//

const instanceAxios = axios.create({
    baseURL: 'https://api.rajaongkir.com/',
    mode: 'no-cors',
    headers: {
        'key': 'a92bf940de73d54372d421393620c4da',
    }
  });

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : cities.filter(lang =>
        lang.city_name.toLowerCase().slice(0, inputLength) === inputValue
    );
};

const getSuggestionValue = suggestion => suggestion.city_name;

const renderSuggestion = suggestion => (
    <div>
        {suggestion.city_name}
    </div>
);


class FormCek extends Component {
    state = {
        semuaKota:[],
        kotaAsal: '',
        objKotaAsal:{},
        kotaTujuan: '',
        objKotaTujuan:{},
        suggestionsKotaAsal: [],
        suggestionsKotaTujuan: [],
        berat:1
    };


    onChangeKotaAsal = (event, { newValue }) => {
        this.setState({
            kotaAsal: newValue
        });
    };
    onChangeKotaTujuan = (event, { newValue }) => {
        this.setState({
            kotaTujuan: newValue
        });
    };
    onChangeBerat=(event)=>{
        this.setState({berat:event.target.value})
    }

    onSuggestionsFetchRequestedKotaAsal = ({ value }) => {
        this.setState({
            suggestionsKotaAsal: getSuggestions(value)
        });
    };

    onSuggestionsFetchRequestedKotaTujuan = ({ value }) => {
        this.setState({
            suggestionsKotaTujuan: getSuggestions(value)
        });
    };

    onSuggestionsClearRequestedKotaAsal = () => {
        this.setState({
            suggestionsKotaAsal: []
        });
    };

    onSuggestionsClearRequestedKotaTujuan = () => {
        this.setState({
            suggestionsKotaTujuan: []
        });
    };

    onSuggestionKotaAsalSelected=(event, { suggestion})=>{
        this.setState({
            objKotaAsal:suggestion
        })
    }

    onSuggestionKotaTujuanSelected=(event, { suggestion})=>{
        this.setState({
            objKotaTujuan:suggestion
        })
    }

    componentDidMount(){
        instanceAxios.get('/starter/city')
            .then(function (response) {console.log(response);
        })
    }

    cekOngkir=(idKotaAsal,idKotaTujuan,weight,courier)=>{
        instanceAxios.post('/starter/city',{
            origin: idKotaAsal,
            destination: idKotaTujuan,
            weight: weight,
            courier: courier
          })
          .then(function (response) {
            console.log(response);
          })
    }

    render() {
        const { kotaAsal, kotaTujuan, suggestionsKotaAsal, suggestionsKotaTujuan, objKotaAsal, objKotaTujuan,berat } = this.state;
        console.log(objKotaTujuan);

        return (
            <div class="flex h-screen">
            <div class="w-2/5 bg-blue-400"></div>
            <div class="w-3/5 p-20">
                <h1 class="text-5xl font-bold headline">Cek Ongkir</h1>
                <p>Seluruh kota di Indonesia tanpa perlu input captcha </p>
                <div class="mt-8">
                    <p class="headline">Kota Asal</p>
                    <Autosuggest
                        suggestions={suggestionsKotaAsal}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedKotaAsal}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequestedKotaAsal}
                        getSuggestionValue={getSuggestionValue}
                        onSuggestionSelected={this.onSuggestionKotaAsalSelected}
                        renderSuggestion={renderSuggestion}
                        inputProps={{
                            placeholder: 'Kota asal pengiriman',
                            value: kotaAsal,
                            onChange: this.onChangeKotaAsal
                        }}
                    />
                </div>
                <div class="mt-6">
                    <p class="headline">Kota Tujuan</p>
                    <Autosuggest
                        suggestions={suggestionsKotaTujuan}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedKotaTujuan}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequestedKotaTujuan}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        onSuggestionSelected={this.onSuggestionKotaTujuanSelected}
                        inputProps={{
                            placeholder: 'Kota tujuan pengiriman',
                            value: kotaTujuan,
                            onChange: this.onChangeKotaTujuan
                        }}
                    />
                </div>
                <div class="mt-6">
                    <p class="headline">Berat</p>
                    <input class="w-8 bg-gray-200" type="text" name="berat" value={berat} onChange={this.onChangeBerat}/> kg
                </div>

                <button 
                type="button" 
                class="headline bg-blue-600 text-white w-1/4 mt-8 p-2 rounded-full"
                onClick={()=>{
                    this.cekOngkir(objKotaAsal.city_id,objKotaTujuan.city_id,berat*1000,"jne")
                }}
                >Cek Ongkir</button>
            </div>
            </div>)
    }

}

export default FormCek;