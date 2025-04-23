import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "../../../../../../store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleHeaderClick = () => {
    setIsProfileOpen(true);
  };

  return (
    <>
      <div
        className="h-[10vh] border-b-2 border-[#2f303b] flex 
        items-center
        justify-between px-20 cursor-pointer"
        onClick={handleHeaderClick}
      >
        <div className="flex gap-5 items-center">
          <div className="flex gap-3 items-center justify-center">
            <div className="w-12 h-12 relative flex items-center justify-center">
              {selectedChatType === "contact" ? (
                <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                  {selectedChatData.image ? (
                    <AvatarImage
                      src={`${HOST}/${selectedChatData.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black rounded-full"
                    />
                  ) : (
                    <div
                      className={`uppercase w-12 h-12 text-lg border-[1px] ${getColor(
                        selectedChatData.color
                      )} flex items-center justify-center rounded-full`}
                    >
                      {selectedChatData.firstName
                        ? selectedChatData.firstName.split("").shift()
                        : selectedChatData.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              ) : (
                <div
                  className={`bg-[#ffffff22] py-3 px-5 flex items-center justify-center rounded-full`}
                >
                  #
                </div>
              )}
            </div>
            <div>
              {selectedChatType === "channel" && selectedChatData.name}
              {selectedChatType === "contact" &&
              selectedChatData.firstName &&
              selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 
            focus:border-none focus:outline-none 
            focus:text-white duration-300 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              closeChat();
            }}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="bg-[#1e1f2a] border-[#2f303b] text-white">
          <DialogHeader className="text-xl font-bold mb-4 text-white text-center items-center justify-center">
            {selectedChatType === "contact" ? "Contact Info" : "Channel Info"}
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {selectedChatType === "contact" ? (
              <>
                <div className="w-24 h-24 relative flex items-center justify-center">
                  {selectedChatData.image ? (
                    <Avatar className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#3a3b45]">
                      <AvatarImage
                        src={`${HOST}/${selectedChatData.image}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black rounded-full"
                      />
                    </Avatar>
                  ) : (
                    <div
                      className={`uppercase w-24 h-24 text-4xl border-2 ${getColor(
                        selectedChatData.color
                      )} flex items-center justify-center rounded-full`}
                    >
                      {selectedChatData.firstName
                        ? selectedChatData.firstName.split("").shift()
                        : selectedChatData.email.split("").shift()}
                    </div>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-semibold text-white">
                    {selectedChatData.firstName} {selectedChatData.lastName}
                  </h3>
                  <p className="text-[#a0a0a0]">{selectedChatData.email}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-[#2f303b] text-5xl flex items-center justify-center rounded-full border-2 border-[#3a3b45]">
                  #
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-semibold text-white">
                    {selectedChatData.name}
                  </h3>
                  <p className="text-[#a0a0a0]">Channel</p>
                  {selectedChatData.description && (
                    <p className="text-[#b0b0b0] mt-2 max-w-md">
                      {selectedChatData.description}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatHeader;
