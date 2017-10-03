import "jest";
import DataStore from "../dataStore";

test("add search params", () => {
    const store = new DataStore();
    const data = [
        { name: "cat", value: "123" },
        { name: "color", value: "50" }
    ];

    const actual = store.addSearchParams("https://testing.com/", data);
    const expected = "https://testing.com/?cat=123&color=50";

    expect(expected).toEqual(actual);
});
