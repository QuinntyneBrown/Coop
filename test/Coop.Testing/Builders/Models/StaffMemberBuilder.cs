using Coop.Core.Models;

namespace Coop.Testing.Builders.Models
{
    public class StaffMemberBuilder
    {
        private StaffMember _staffMember;

        public static StaffMember WithDefaults()
        {
            return new StaffMember(default, default, default, default);
        }

        public StaffMemberBuilder()
        {
            _staffMember = WithDefaults();
        }

        public StaffMember Build()
        {
            return _staffMember;
        }
    }
}
