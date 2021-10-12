#!/usr/bin/env node
import axios from 'axios';
import { getCode } from 'country-list';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';

const year = process.argv[3] || new Date().getFullYear();
const country = getCode(process.argv[2]);
figlet(`${country}\'s holidays`, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});
const spinner = ora("Fetching data").start();

const getHolidays = async () => {
    try {
        const response = await axios.get(
            `https://date.nager.at/api/v3/publicholidays/${year}/${country}`
        );
        if (response.status === 200) {
            spinner.succeed("Data fetched !");
        };
        return response.data;
    }catch(err){
        spinner.fail("Sorry, but that's a no from me.");
    }
};

const displayHolidays = async () => {
    const holidays = await getHolidays();
    holidays.map((holiday) => {
        console.log(
            `${chalk.blue.bold(holiday.date)}: ${chalk.cyan(holiday.name)} - aka - ${chalk.magentaBright.italic(holiday.localName)}`
        );
    });
};

displayHolidays();
