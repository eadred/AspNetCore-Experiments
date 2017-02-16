using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.Suites
{
    public class SuiteException : Exception
    {
        public SuiteErrorType ErrorType { get; private set; }

        public SuiteException(SuiteErrorType errorType, string message) : base(message)
        {
            ErrorType = errorType;
        }

        public SuiteException(SuiteErrorType errorType, string message, Exception innerException) : base(message, innerException)
        {
            ErrorType = errorType;
        }

        public enum SuiteErrorType
        {
            NameBlank,
            NameConflict
        }
    }
}
