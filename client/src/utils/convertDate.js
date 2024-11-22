export const changeDateFormatToNLN = (date) => {
    const dateObj = new Date(date);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
}