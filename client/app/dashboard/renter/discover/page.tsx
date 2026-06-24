"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, MessageSquare, ShieldCheck, MapPin, Phone, Mail, Star, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/pages/search/Search";
import VehicleCard from "@/components/base/cards/VehicleCard";
import { useVehicles } from "@/hooks/useVehicles";
import { useVendors } from "@/hooks/useUser";
import { SearchFilters } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { messagingService } from "@/services/messaging.service";
import { toast } from "sonner";

export default function SearchWithNavbar() {
  const [tab, setTab] = useState<"vehicles" | "businesses">("vehicles");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Modals / Detail state
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [contactVendor, setContactVendor] = useState<any | null>(null);
  const [initialMessage, setInitialMessage] = useState("Hi, I am interested in renting one of your vehicles. Are they available?");
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  const router = useRouter();

  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  const { vendors, isLoading: isLoadingVendors } = useVendors();

  const handleSearch = (filters: SearchFilters) => {
    const query = (filters.query ?? "").toLowerCase();
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleFavoriteToggle = (carId: string) => {
    console.log("Toggled favorite for car:", carId);
  };

  const handleRentNow = (carId: string) => {
    router.push(`/dashboard/renter/vehicles/${carId}`);
  };

  const filteredCars = useMemo(() => {
    if (!vehicles) return [];

    let filtered = vehicles;

    if (activeFilter !== "all") {
      filtered = vehicles.filter((car: any) =>
        activeFilter === "favorites"
          ? car.isFavorite
          : car.category?.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((car: any) =>
        car.name?.toLowerCase().includes(searchQuery) ||
        car.category?.toLowerCase().includes(searchQuery) ||
        car.fuel?.toLowerCase().includes(searchQuery) ||
        car.transmission?.toLowerCase().includes(searchQuery)
      );
    }

    return filtered;
  }, [vehicles, activeFilter, searchQuery]);

  const filteredVendors = useMemo(() => {
    if (!vendors) return [];
    if (!searchQuery) return vendors;
    return vendors.filter((v: any) => {
      const name = `${v.firstName} ${v.lastName}`.toLowerCase();
      const bizName = (v.hostProfile?.businessName || "").toLowerCase();
      const tradName = (v.hostProfile?.tradingName || "").toLowerCase();
      return name.includes(searchQuery) || bizName.includes(searchQuery) || tradName.includes(searchQuery);
    });
  }, [vendors, searchQuery]);

  const handleStartChat = async () => {
    if (!contactVendor) return;

    // Find a vehicle belonging to this host to satisfy DB relation requirement
    const hostProfileId = contactVendor.hostProfile?.id;
    const hostVehicle = vehicles?.find((v: any) => v.hostId === hostProfileId);

    if (!hostVehicle) {
      toast.error("This business does not have any active vehicles to book.");
      return;
    }

    try {
      setIsSendingMsg(true);
      const conversation = await messagingService.createConversation({
        hostUserId: contactVendor.id,
        vehicleId: hostVehicle.id,
        initialMessage: initialMessage
      });
      toast.success(`Started conversation with ${contactVendor.hostProfile?.businessName || contactVendor.firstName}`);
      setContactVendor(null);
      router.push(`/dashboard/renter/messages`);
    } catch (err: any) {
      toast.error(err.message || "Could not start chat");
    } finally {
      setIsSendingMsg(false);
    }
  };

  return (
    <div className="space-y-6 font-primary">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-primary">
            Discover
          </h1>
          <p className="text-sm text-muted-foreground font-secondary">
            Find premium vehicles or connect with verified rental businesses
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border pb-px">
        <button
          onClick={() => { setTab("vehicles"); setSearchQuery(""); }}
          className={`pb-3 text-sm font-semibold border-b-2 px-1 transition-all ${tab === "vehicles"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Available Cars
        </button>
        <button
          onClick={() => { setTab("businesses"); setSearchQuery(""); }}
          className={`pb-3 text-sm font-semibold border-b-2 px-1 transition-all ${tab === "businesses"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Rental Businesses
        </button>
      </div>

      <div className="max-w-4xl">
        <SearchBar onSearch={handleSearch} />
      </div>

      {tab === "vehicles" ? (
        <>
          <div className="flex flex-wrap gap-3">
            {["all", "sport", "suv", "luxury", "hatchback", "favorites"].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full font-primary capitalize ${activeFilter === filter ? "bg-primary text-white hover:bg-primary/95" : ""}`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter === "all" ? "All Cars" : filter}
              </Button>
            ))}
          </div>

          <div>
            <p className="text-sm text-muted-foreground font-secondary">
              Showing <span className="font-bold text-primary font-primary">{filteredCars.length}</span> cars
              {searchQuery && (
                <span> for "<span className="font-bold">{searchQuery}</span>"</span>
              )}
            </p>
          </div>

          {isLoadingVehicles ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCars.map((car: any) => (
                <VehicleCard
                  key={car.id}
                  vehicle={car}
                  onFavoriteToggle={handleFavoriteToggle}
                  onRentNow={handleRentNow}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground font-primary">
                No cars found
              </h3>
              <p className="text-sm text-muted-foreground font-secondary">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </>
      ) : (
        // Businesses Listing
        <>
          <div>
            <p className="text-sm text-muted-foreground font-secondary">
              Showing <span className="font-bold text-primary font-primary">{filteredVendors.length}</span> verified businesses
            </p>
          </div>

          {isLoadingVendors ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredVendors.map((vendor: any) => {
                const businessName = vendor.hostProfile?.businessName || `${vendor.firstName} ${vendor.lastName}`;
                const rating = vendor.hostProfile?.avgRating || 5.0;
                const reviews = vendor.hostProfile?.totalReviews || 0;

                return (
                  <div key={vendor.id} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0 text-primary-foreground">
                          {businessName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-foreground truncate font-primary">{businessName}</h3>
                            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-foreground">{rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1 text-xs text-muted-foreground font-secondary">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{vendor.hostProfile?.businessAddress || "Lagos, Nigeria"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>Verified Fleet Host</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-primary h-9 rounded-xl"
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs bg-primary hover:bg-primary/90 text-white font-primary h-9 rounded-xl"
                        onClick={() => {
                          setContactVendor(vendor);
                          setInitialMessage(`Hi, I am interested in renting one of your vehicles. Are they available?`);
                        }}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                        Contact
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground font-primary">
                No businesses found
              </h3>
              <p className="text-sm text-muted-foreground font-secondary">
                We couldn't find any rental companies matching your criteria.
              </p>
            </div>
          )}
        </>
      )}

      {/* Business Profile Viewer Modal */}
      <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
        {selectedVendor && (() => {
          const businessName = selectedVendor.hostProfile?.businessName || `${selectedVendor.firstName} ${selectedVendor.lastName}`;
          const rating = selectedVendor.hostProfile?.avgRating || 5.0;
          const reviews = selectedVendor.hostProfile?.totalReviews || 0;
          const hostProfileId = selectedVendor.hostProfile?.id;
          const hostVehiclesCount = vehicles?.filter((v: any) => v.hostId === hostProfileId).length || 0;

          return (
            <DialogContent className="max-w-xl font-secondary rounded-2xl">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20 shrink-0 text-primary-foreground">
                    {businessName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="font-primary text-xl flex items-center gap-2">
                      {businessName}
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </DialogTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 py-4 border-t border-b border-slate-100 my-2 text-sm text-foreground">
                <div>
                  <h4 className="font-semibold text-foreground font-primary mb-1">About Business</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    This is a verified professional vehicle supplier on Rydway. Offering premium services, clean fleets, and comprehensive insurance.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-secondary">
                  <div className="space-y-1">
                    <span className="text-muted-foreground block">Fleet Location</span>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{selectedVendor.hostProfile?.businessAddress || "Lagos, Nigeria"}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground block">Active Vehicles</span>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <span>{hostVehiclesCount} Cars Registered</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground block">Support Email</span>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{selectedVendor.hostProfile?.businessEmail || selectedVendor.email}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground block">Support Phone</span>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{selectedVendor.hostProfile?.businessPhone || selectedVendor.phone || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedVendor(null)}
                  className="rounded-xl text-xs font-primary"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setContactVendor(selectedVendor);
                    setSelectedVendor(null);
                    setInitialMessage(`Hi, I am interested in renting one of your vehicles. Are they available?`);
                  }}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-primary"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          );
        })()}
      </Dialog>

      {/* Start Chat Modal */}
      <Dialog open={!!contactVendor} onOpenChange={(open) => !open && setContactVendor(null)}>
        {contactVendor && (() => {
          const businessName = contactVendor.hostProfile?.businessName || `${contactVendor.firstName} ${contactVendor.lastName}`;
          return (
            <DialogContent className="max-w-md font-secondary rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-primary text-lg flex items-center gap-2">
                  Message {businessName}
                </DialogTitle>
                <DialogDescription>
                  Start a direct chat log with this vendor regarding booking queries.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3">
                <Label htmlFor="initial-message" className="text-xs font-semibold text-foreground">Initial Inquiry Message</Label>
                <Textarea
                  id="initial-message"
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="rounded-xl text-sm"
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setContactVendor(null)}
                  className="rounded-xl text-xs font-primary"
                  disabled={isSendingMsg}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartChat}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-primary"
                  disabled={isSendingMsg || !initialMessage.trim()}
                >
                  {isSendingMsg ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          );
        })()}
      </Dialog>
    </div>
  );
}