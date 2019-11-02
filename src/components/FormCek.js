import React, { Component } from 'react';
import '../styles/FormCek.css';
import Autosuggest from 'react-autosuggest';

const languages = [
    {
        name: 'C',
        year: 1972
    },
    {
        name: 'crr',
        year: 2012
    },
    {
        name: 'crrsdfsd',
        year: 2012
    }];

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : languages.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}
    </div>
);


class FormCek extends Component {
    state = {
        kotaAsal: '',
        KotaTujuan: '',
        suggestionsKotaAsal: [],
        suggestionsKotaTujuan: []
    };


    onChangeKotaAsal = (event, { newValue }) => {
        this.setState({
            kotaAsal: newValue
        });
    };
    onChangeKotaTujuan = (event, { newValue }) => {
        this.setState({
            KotaTujuan: newValue
        });
    };

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

    render() {
        const { kotaAsal, kotaTujuan, suggestionsKotaAsal, suggestionsKotaTujuan } = this.state;

        return (
            <div>
                <h1 class="headline">Cek Ongkir</h1>
                <p>Seluruh kota di Indonesia tanpa perlu input captcha </p>
                <div>
                    <p class="headline">Kota Asal</p>
                    <Autosuggest
                        suggestions={suggestionsKotaAsal}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedKotaAsal}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequestedKotaAsal}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={{
                            placeholder: 'Kota asal pengiriman',
                            value: kotaAsal,
                            onChange: this.onChangeKotaAsal
                        }}
                    />
                </div>
                {/* <div>
                    <p class="headline">Kota Tujuan</p>
                    <Autosuggest
                        suggestions={suggestionsKotaTujuan}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedKotaTujuan}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequestedKotaTujuan}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={{
                            placeholder: 'Kota tujuan pengiriman',
                            value: kotaTujuan,
                            onChange: this.onChangeKotaTujuan
                        }}
                    />
                </div> */}

                <button type="button" class="headline bg-blue-600 text-white w-1/4">Cek Ongkir</button>

            </div>)
    }

}

export default FormCek;