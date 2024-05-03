const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

  export function TableRowSkeleton() {
    return (
      <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
        {/* Customer Name and Image */}
        <td className="relative py-3 pl-6 pr-3 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-24 h-6 bg-gray-100 rounded"></div>
          </div>
        </td>
        {/* Email */}
        <td className="px-3 py-3 whitespace-nowrap">
          <div className="w-32 h-6 bg-gray-100 rounded"></div>
        </td>
        {/* Amount */}
        <td className="px-3 py-3 whitespace-nowrap">
          <div className="w-16 h-6 bg-gray-100 rounded"></div>
        </td>
        {/* Date */}
        <td className="px-3 py-3 whitespace-nowrap">
          <div className="w-16 h-6 bg-gray-100 rounded"></div>
        </td>
        {/* Status */}
        <td className="px-3 py-3 whitespace-nowrap">
          <div className="w-16 h-6 bg-gray-100 rounded"></div>
        </td>
        {/* Actions */}
        
      </tr>
    );
  }

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-400 p-4 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="w-5 h-5 bg-gray-200 rounded-md" />
        <div className="w-16 h-6 ml-2 text-sm font-medium bg-gray-200 rounded-md" />
      </div>
      <div className="flex items-center justify-center px-4 py-8 truncate bg-white rounded-xl">
        <div className="w-20 bg-gray-200 rounded-md h-7" />
      </div>
    </div>
  );
  }
  export default function TableSkeleton() {
    return (
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="p-2 rounded-lg bg-gray-50 md:pt-0">
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="text-sm font-normal text-left rounded-lg">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Company
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    PC Name
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Mac Address
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Date Purchased
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Age
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  export function TableMobileSkeleton() {
    return (
      <div className="w-full p-4 mb-2 bg-white rounded-md">
        <div className="flex items-center justify-between pb-8 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 bg-gray-100 rounded-full"></div>
            <div className="w-16 h-6 bg-gray-100 rounded"></div>
          </div>
          <div className="w-16 h-6 bg-gray-100 rounded"></div>
        </div>
        <div className="flex items-center justify-between w-full pt-4">
          <div>
            <div className="w-16 h-6 bg-gray-100 rounded"></div>
            <div className="w-24 h-6 mt-2 bg-gray-100 rounded"></div>
          </div>
          <div className="flex justify-end gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded"></div>
            <div className="w-10 h-10 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }