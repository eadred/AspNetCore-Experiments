using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.Suites
{
    public class SuiteException : Exception
    {
        public SuiteException(string message) : base(message) { }

        public SuiteException(string message, Exception innerException) : base(message, innerException) { }
    }
}
