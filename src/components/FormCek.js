import React, { Component } from 'react';
import '../styles/FormCek.css';
import '../styles/autosuggest.css';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import { isEmpty, capitalize } from 'lodash';
import ReactLoading from "react-loading";
import { cities } from '../assets/Cities';
//
import jneLogo from '../assets/jne.png'
import posLogo from '../assets/pos.png'
import tikiLogo from '../assets/tiki.png'

const instanceAxios = axios.create({
    baseURL: 'https://api.rajaongkir.com/',
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
        semuaKota: [],
        kotaAsal: '',
        objKotaAsal: {},
        kotaTujuan: '',
        objKotaTujuan: {},
        suggestionsKotaAsal: [],
        suggestionsKotaTujuan: [],
        berat: 1,
        hasilOngkir: {},
        kurir: 'jne'
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
    onChangeBerat = (event) => {
        this.setState({ berat: event.target.value })
    }

    onChangeKurir = (kurir) => {
        this.setState({ kurir: kurir })
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

    onSuggestionKotaAsalSelected = (event, { suggestion }) => {
        this.setState({
            objKotaAsal: suggestion
        })
    }

    onSuggestionKotaTujuanSelected = (event, { suggestion }) => {
        this.setState({
            objKotaTujuan: suggestion
        })
    }

    componentDidMount() {
        instanceAxios.get('/starter/city')
            .then(function (response) {
                console.log(response);
            })
    }

    cekOngkir = (idKotaAsal, idKotaTujuan, weight) => {
        instanceAxios.post('/starter/cost', {
            origin: idKotaAsal,
            destination: idKotaTujuan,
            weight: weight,
            courier: this.state.kurir
        })
            .then((response) => {
                this.setState({
                    hasilOngkir: response.data.rajaongkir
                })
            })
    }

    render() {
        const { kotaAsal, kotaTujuan, suggestionsKotaAsal, suggestionsKotaTujuan,
            objKotaAsal, objKotaTujuan, berat, hasilOngkir, kurir } = this.state;
        console.log(hasilOngkir);

        return (
            <div className="container">
                <div className="container-pic"></div>
                <div className="container-form">
                    <h1 className="headline">Cek Ongkir</h1>
                    <p className="subtitle">Seluruh kota di Indonesia tanpa perlu input captcha </p>

                    <div className="container-suggest">
                        <div className="form-item">
                            <p className="label-form">Kota Asal</p>
                            <Autosuggest
                                suggestions={suggestionsKotaAsal}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedKotaAsal}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequestedKotaAsal}
                                getSuggestionValue={getSuggestionValue}
                                onSuggestionSelected={this.onSuggestionKotaAsalSelected}
                                renderSuggestion={renderSuggestion}
                                inputProps={{
                                    placeholder: 'Asal pengiriman',
                                    value: kotaAsal,
                                    onChange: this.onChangeKotaAsal
                                }}
                            />
                        </div>
                        <div className="form-item">
                            <p className="label-form">Kota Tujuan</p>
                            <Autosuggest
                                suggestions={suggestionsKotaTujuan}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedKotaTujuan}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequestedKotaTujuan}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                onSuggestionSelected={this.onSuggestionKotaTujuanSelected}
                                inputProps={{
                                    placeholder: 'Tujuan pengiriman',
                                    value: kotaTujuan,
                                    onChange: this.onChangeKotaTujuan
                                }}
                            />
                        </div>
                        <div className="form-item">
                            <p className="label-form">Berat</p>
                            <input className="input-berat" type="text" name="berat" value={berat} onChange={this.onChangeBerat} /> kg
                        </div>
                    </div>

                    <div className="form-item">
                        <p className="label-form">Kurir </p>
                        <div className="container-kurir">
                            <div
                                onClick={() => { this.onChangeKurir("jne") }}
                                className={kurir == "jne" && "kurir-active"}>
                                <img src={jneLogo} />
                            </div>
                            <div
                                onClick={() => { this.onChangeKurir("tiki") }}
                                className={kurir == "tiki" && "kurir-active"}>
                                <img src={tikiLogo} />
                            </div>
                            <div onClick={() => { this.onChangeKurir("pos") }}
                                className={kurir == "pos" && "kurir-active"}>
                                <img src={posLogo} />
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn form-item"
                        disabled={kotaAsal == "" || kotaTujuan == ""}
                        onClick={() => {
                            this.cekOngkir(objKotaAsal.city_id, objKotaTujuan.city_id, berat * 1000)
                        }}
                    >Cek Ongkir</button>

                    {isEmpty(hasilOngkir) ?
                        <div><ReactLoading /></div> :
                        <div className="container-result">
                            {/* <h1 className="headline result">Ongkos Kirim {hasilOngkir.origin_details.city_name} ke {hasilOngkir.destination_details.city_name}</h1> */}
                            <h2>Kurir : {hasilOngkir.results[0].name}</h2>
                            <div className="container-item-service">
                                {hasilOngkir.results[0].costs.map((item) => {
                                    return (
                                        <div className="item-service">
                                            <h1>{item.service}</h1>
                                            <p>Rp. {item.cost[0].value.toLocaleString()}</p>
                                            <p>Estimasi {capitalize(item.cost[0].etd)} {item.cost[0].etd.search("hari") == -1 ? "hari" : ""}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    }

                </div>
            </div >)
    }

}

export default FormCek;