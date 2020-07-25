function getCurrentDate() {
    let date = new Date();

    let months = ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sept.','Oct.','Nov.','Dec.'];

    let month = months[date.getMonth()];
    let day = addOrdinalIndicator(date.getDate());
    function addOrdinalIndicator(day) {
        switch (day) {
            case 1:
            case 21:
            case 31:
            case "1":
            case "21":
            case "31":
                day += "st";
                break;
            case 2:
            case 22:
            case "2":
            case "22":
                day += "nd";
                break;
            case 3:
            case 23:
            case "3":
            case "23":
                day += "rd";
                break;
            default:
                day += "th";
                break
        }
        return day;
    }

    let fulldate = `${month} ${day}`;

    return fulldate;
}
