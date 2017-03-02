System.register("multiplier", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Multiplier;
    return {
        setters: [],
        execute: function () {
            Multiplier = (function () {
                function Multiplier(name, multiplier) {
                    this._name = name;
                    this._multiplier = multiplier;
                }
                Object.defineProperty(Multiplier.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Multiplier.prototype, "multiplier", {
                    get: function () {
                        return this._multiplier;
                    },
                    enumerable: true,
                    configurable: true
                });
                Multiplier.prototype.multiply = function (input) {
                    return input * this._multiplier;
                };
                return Multiplier;
            }());
            exports_1("Multiplier", Multiplier);
        }
    };
});
System.register("multiplyIt", ["multiplier"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function multiplyIt(x) {
        var m = new multiplier_1.Multiplier("Test", 3);
        return m.multiply(x);
    }
    exports_2("multiplyIt", multiplyIt);
    var multiplier_1;
    return {
        setters: [
            function (multiplier_1_1) {
                multiplier_1 = multiplier_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("main", ["multiplyIt"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var multiplyIt_1, result;
    return {
        setters: [
            function (multiplyIt_1_1) {
                multiplyIt_1 = multiplyIt_1_1;
            }
        ],
        execute: function () {
            console.log("In main typescript module code");
            result = multiplyIt_1.multiplyIt(5);
            console.log("Result is " + result);
        }
    };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnQvdHMvbXVsdGlwbGllci50cyIsImNvbnRlbnQvdHMvbXVsdGlwbHlJdC50cyIsImNvbnRlbnQvdHMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O1lBQUE7Z0JBSUksb0JBQVksSUFBWSxFQUFFLFVBQWlCO29CQUN2QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztvQkFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7Z0JBQ2xDLENBQUM7Z0JBRUQsc0JBQUksNEJBQUk7eUJBQVI7d0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3RCLENBQUM7OzttQkFBQTtnQkFFRCxzQkFBSSxrQ0FBVTt5QkFBZDt3QkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDNUIsQ0FBQzs7O21CQUFBO2dCQUVNLDZCQUFRLEdBQWYsVUFBZ0IsS0FBYTtvQkFDekIsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNwQyxDQUFDO2dCQUNMLGlCQUFDO1lBQUQsQ0FwQkEsQUFvQkMsSUFBQTs7UUFBQSxDQUFDOzs7Ozs7SUNsQkYsb0JBQTJCLENBQVM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsSUFBSSx1QkFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDOzs7Ozs7Ozs7O1FBQUEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7WUNIRixPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFFMUMsTUFBTSxHQUFHLHVCQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFBQSxDQUFDIiwiZmlsZSI6InRzb3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIE11bHRpcGxpZXIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmFtZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbXVsdGlwbGllcjogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBtdWx0aXBsaWVyOm51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuX211bHRpcGxpZXIgPSBtdWx0aXBsaWVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG11bHRpcGxpZXIoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbXVsdGlwbGllcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoaW5wdXQ6IG51bWJlcik6bnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gaW5wdXQgKiB0aGlzLl9tdWx0aXBsaWVyO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgTXVsdGlwbGllciB9IGZyb20gXCIuL211bHRpcGxpZXJcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtdWx0aXBseUl0KHg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICB2YXIgbSA9IG5ldyBNdWx0aXBsaWVyKFwiVGVzdFwiLCAzKTtcclxuICAgIHJldHVybiBtLm11bHRpcGx5KHgpO1xyXG59IiwiaW1wb3J0IHsgbXVsdGlwbHlJdCB9IGZyb20gXCIuL211bHRpcGx5SXRcIjtcclxuXHJcbmNvbnNvbGUubG9nKFwiSW4gbWFpbiB0eXBlc2NyaXB0IG1vZHVsZSBjb2RlXCIpO1xyXG5cclxudmFyIHJlc3VsdCA9IG11bHRpcGx5SXQoNSk7XHJcblxyXG5jb25zb2xlLmxvZyhcIlJlc3VsdCBpcyBcIiArIHJlc3VsdCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
