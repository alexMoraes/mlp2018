interface IPlayer {
    ReceiveArmy(quantity: number): void;
    PlaceArmy(countries: Array<ICountry>): Array<number>;
    SelectCountry(countries: Array<ICountry>): ICountry;
}