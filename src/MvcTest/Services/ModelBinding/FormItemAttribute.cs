using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.ModelBinding
{
    [AttributeUsage(AttributeTargets.Parameter, AllowMultiple = false)]
    public class FormItemAttribute : Attribute
    {
        public string ItemName { get; set; }
    }
}
