const axios = require("axios");
import "datatables.net";
import { Country } from "./types";

$(() => {
  const table = $("#table").DataTable({
    dom: "tp",
    scrollX: true,
    pageLength: 20
  });

  $("form").on("submit", (e) => {
    e.preventDefault();
    const filterProps = [...e.target.querySelectorAll("input")]
      .reduce((acc, curr) => {
        const val = curr.value;
        const id = curr.id;
        if (val) {
          if (id == "currency" || id == "language") {
            return [...acc, `${id}.name=${val}`];
          } else {
            return [...acc, `${id}=${val}`];
          }
        } else {
          return acc;
        }
      }, [])
      .join("&");

    if (filterProps) {
      axios
        .get(`http://localhost:3004/countries?${filterProps}`)
        .then(({ data }: { data: Array<Country> }) => {
          table.clear().draw();
          data.forEach((country: Country) => {
            table.row
              .add([
                country.name,
                country.capital,
                country.currency.name,
                country.language.name,
              ])
              .draw();
          });
        });
    } else {
      table.clear().draw();
    }
  });
});
