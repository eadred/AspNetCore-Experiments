using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Models
{
    public class TestItem
    {
        public TestItem(int id)
        {
            Id = id;
        }

        public int Id { get; private set; }
    }
}
