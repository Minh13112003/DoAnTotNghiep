﻿namespace DoAnTotNghiep.Model
{
    public class History
    {
        public string IdMovie {  get; set; } = string.Empty;
        public string UserName {  get; set; } = string.Empty;
        public virtual Movie? Movie { get; set; }
       
    }
}
