using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace MvcTest.Services.Suites
{
    public static class SuiteExtensions
    {
        public static HttpStatusCode ToHttpErrorCode(this SuiteException.SuiteErrorType errType)
        {
            HttpStatusCode statusCode;
            switch (errType)
            {
                case SuiteException.SuiteErrorType.NameBlank:
                    statusCode = HttpStatusCode.BadRequest;
                    break;
                case SuiteException.SuiteErrorType.NameConflict:
                    statusCode = HttpStatusCode.Conflict;
                    break;
                case SuiteException.SuiteErrorType.NotFound:
                    statusCode = HttpStatusCode.NotFound;
                    break;
                default:
                    statusCode = HttpStatusCode.BadRequest;
                    break;
            }

            return statusCode;
        }
    }
}
