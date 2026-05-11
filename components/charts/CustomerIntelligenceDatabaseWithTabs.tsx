'use client'

interface DistributorData {
  distributorCompanyName: string
  headquarters: string
  geographicalPresence: string
  products: string
  contactDetails: string
}

// Distributor data from provided tables
const distributorData: DistributorData[] = [
  {
    distributorCompanyName: 'Zytomed Systems GmbH',
    headquarters: 'Berlin, Germany',
    geographicalPresence: 'Germany, Europe',
    products: 'DBS IHC antibodies and reagents; examples include TRPS1 (RMAB114), CD23 (SP23), CD138 (EP201), Ki67+p16 Cocktail',
    contactDetails: '030-804 984 999, info@zytomed-systems.de'
  },
  {
    distributorCompanyName: 'BIOMIKA MB',
    headquarters: 'Vilnius, Lithuania',
    geographicalPresence: 'Baltic States',
    products: 'DBS primary antibodies and pathology reagents; examples: CD3 T-Cell, CD23 (SP23), Collagen Type IV, Ki67+p16 Cocktail',
    contactDetails: '+370 611 74996, biomikalt@gmail.com'
  },
  {
    distributorCompanyName: 'S.I.A.L',
    headquarters: 'Rome, Italy',
    geographicalPresence: 'Italy',
    products: 'Antibodies.com product range; examples: Anti-YB1 [ARC0797], Anti-Cyclin D1 [ARC0300], Anti-Nitrotyrosine [39B6], plus primary / recombinant / ELISA antibodies',
    contactDetails: '+39 06 66 25 280, info@sialgroup.com'
  },
  {
    distributorCompanyName: 'Zotal',
    headquarters: 'Tel Aviv-Yafo, Israel',
    geographicalPresence: 'Israel',
    products: 'Antibodies.com antibodies for IHC / ELISA; examples: Anti-Vimentin [ARC0086], Anti-YB1 [ARC0797], Anti-Nitrotyrosine [39B6], recombinant antibody lines',
    contactDetails: '+972 3-649-2444, info@zotal.co.il'
  },
  {
    distributorCompanyName: 'Biolyst Scientific',
    headquarters: 'Pennsylvania, U.S.',
    geographicalPresence: 'United States',
    products: 'DBS antibody and reagent portfolio; examples: CD138, CD20, CD3, Caspase 3',
    contactDetails: '800 523-5874, info@biolyst.com'
  },
  {
    distributorCompanyName: 'Bio-Connect',
    headquarters: 'Huissen, Netherlands',
    geographicalPresence: 'Netherlands',
    products: 'Anti-GFAP [10G1G11H7], Anti-GFAP R416WT [N206B/9], and Anti-GFAP Antibody AMAB91033',
    contactDetails: '+31 26 3264450, info@bio-connect.nl'
  },
  {
    distributorCompanyName: 'LubioScience',
    headquarters: 'Zurich, Switzerland',
    geographicalPresence: 'Switzerland',
    products: 'ET1611-58, ET1701-50, and ET1609-69',
    contactDetails: '+41 41 417 02 80, info@lubio.ch'
  },
  {
    distributorCompanyName: 'BIOZOL',
    headquarters: 'Eching, Germany',
    geographicalPresence: 'Germany',
    products: 'PAX-8 Mouse Monoclonal Antibody (2B11), IgG1, PAX-8 Mouse Monoclonal Antibody (5B1), IgG1, PAX-8 Mouse Monoclonal Antibody (3H11)',
    contactDetails: '+49-89-37 99 666-6, info@biozol.de'
  },
  {
    distributorCompanyName: 'CliniSciences',
    headquarters: 'Nanterre, France',
    geographicalPresence: 'France',
    products: 'Anti-MSH2 Rabbit Monoclonal Antibody [RM375], MLANA/Mart 1 Rabbit Monoclonal Antibody',
    contactDetails: '+33 9 77 40 09 09, info@clinisciences.com'
  },
  {
    distributorCompanyName: 'Labclinics',
    headquarters: 'Barcelona, Spain',
    geographicalPresence: 'Spain',
    products: 'Anti-PAX8 Antibody, Procathepsin K Human, Mouse Monoclonal Antibody, Clone: 4B9',
    contactDetails: '+34 934 464 70, info@labclinics.com'
  },
  {
    distributorCompanyName: 'Cedarlane',
    headquarters: 'Ontario, Canada',
    geographicalPresence: 'Canada and the U.S.',
    products: 'Anti-Human (CD45 (T200)), Biotin (clone YAML 501.4), Anti-Mouse CD3e, Alexa Fluor 647 (Clone 145-2C11), Anti-Rat CD71 Purified (Clone OX-26)',
    contactDetails: '1-800-268-5058, sales@cedarlanelabs.com'
  },
  {
    distributorCompanyName: 'Funakoshi',
    headquarters: 'Tokyo, Japan',
    geographicalPresence: 'Japan',
    products: 'Rat-Mono (KM2119) and Anti-Klotho, Human, Rat-Mono (KM2076)',
    contactDetails: '+81-3-5684-6296, export@funakoshi.co.jp'
  },
  {
    distributorCompanyName: 'Cosmo Bio',
    headquarters: 'Tokyo, Japan',
    geographicalPresence: 'Japan',
    products: 'PAX8 (MRQ-50), Anti AFP monoclonal antibody NB-011',
    contactDetails: '+81-3-5632-9600, export@cosmobio.co.jp'
  },
  {
    distributorCompanyName: 'Avantor / VWR',
    headquarters: 'Pennsylvania, U.S',
    geographicalPresence: 'Europe, U.S., Asia Pacific, Middle East, Africa',
    products: 'Anti-ALPL Mouse Monoclonal Antibody [clone: ALPL/597]',
    contactDetails: '1-800-932-5000'
  }
]

interface CustomerIntelligenceDatabaseProps {
  height?: number
}

export default function CustomerIntelligenceDatabaseWithTabs({ height }: CustomerIntelligenceDatabaseProps) {
  const renderDistributorTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-[#3A7D8F] text-white sticky top-0 z-10">
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
              Distributor Company Name
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
              Headquarters
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
              Geographical Presence
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
              Products
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
              Contact Details
            </th>
          </tr>
        </thead>
        <tbody>
          {distributorData.map((distributor, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-[#E0F7FA]' : 'bg-white'}>
              <td className="border border-gray-300 px-4 py-3 text-sm text-black font-medium">{distributor.distributorCompanyName}</td>
              <td className="border border-gray-300 px-4 py-3 text-sm text-black">{distributor.headquarters}</td>
              <td className="border border-gray-300 px-4 py-3 text-sm text-black">{distributor.geographicalPresence}</td>
              <td className="border border-gray-300 px-4 py-3 text-sm text-black">{distributor.products}</td>
              <td className="border border-gray-300 px-4 py-3 text-sm text-black">{distributor.contactDetails}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-black mb-4">Distributor Intelligence Database</h3>
      <div className="overflow-auto border rounded-lg" style={{ maxHeight: height ? `${height}px` : '600px' }}>
        {renderDistributorTable()}
      </div>
    </div>
  )
}
