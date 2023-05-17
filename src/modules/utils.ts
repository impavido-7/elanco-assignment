import moment from "moment";

const getValuesFromData = (data: any): any[] => {
  const values: any[] = [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          for (const item of value) {
            values.push(...getValuesFromData(item));
          }
        } else {
          values.push(...getValuesFromData(value));
        }
      } else {
        values.push(value);
      }
    }
  }

  return values;
};

export const filterDataFromList = (
  searchText: string,
  listToCheck: any[]
): any[] => {
  const filteredList = [];

  for (let i = 0; i < listToCheck.length; i++) {
    const valuesAvailable = getValuesFromData(listToCheck[i]);

    const isAvailable = valuesAvailable.some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchText.toLowerCase());
      } else if (typeof value === "number") {
        return value
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase());
      } else if (typeof value === "boolean") {
        return value === (searchText.toLowerCase() === "true");
      }
      return false;
    });

    if (isAvailable) {
      filteredList.push(listToCheck[i]);
    }
  }

  return filteredList;
};

export const filterDateByDateRange = (
  listToFilter: any[],
  startDate: Date,
  endDate: Date
): any[] => {
  console.log(startDate);
  console.log(endDate);

  return listToFilter.filter((list) => {
    const formattedDate = new Date(list.Date.split("/").reverse().join("/"));
    if (
      moment(startDate).isSameOrBefore(formattedDate) &&
      moment(formattedDate).isSameOrBefore(endDate)
    ) {
      return true;
    }
    return false;
  });
};
